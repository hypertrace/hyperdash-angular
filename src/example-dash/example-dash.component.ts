// tslint:disable:no-invalid-template-strings max-inline-declarations
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import {
  Dashboard,
  DataSource,
  dataSourceMarker,
  EditorApi,
  JsonPrimitive,
  Model,
  ModelApi,
  ModelProperty,
  ModelPropertyEditor,
  NUMBER_PROPERTY,
  Renderer,
  STRING_PROPERTY
} from '@hypertrace/hyperdash';
import {
  EDITOR_API,
  ModelChangedEventService,
  ModelInject,
  MODEL_API,
  RendererApi,
  RENDERER_API
} from '@hypertrace/hyperdash-angular';
import { remove } from 'lodash-es';
import { EMPTY, interval, Observable, of } from 'rxjs';
// tslint:disable-next-line:no-submodule-imports
import { catchError, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-example-dash',
  templateUrl: './example-dash.component.html',
  styleUrls: ['./example-dash.component.scss']
})
export class ExampleDashComponent implements OnInit {
  public json: { [key: string]: JsonPrimitive } = {
    type: 'example-container',
    children: [
      {
        type: 'example-model',
        title: 'Variable data source example',
        data: {
          type: 'example-data-source',
          text: '${foo}',
          exclamations: '${bar}',
          rate: '${baz}'
        },
        theme: {
          type: 'theme',
          'background-color': 'whitesmoke',
          'text-color': 'navy'
        }
      },
      {
        type: 'example-model',
        title: 'Second child',
        theme: {
          type: 'theme',
          'background-color': 'ivory'
        }
      },
      {
        type: 'example-model',
        title: 'Third child',
        data: {
          type: 'graphql-data-source',
          query: '{  spans { ${spanFields} } }'
        }
      }
    ],
    data: {
      type: 'example-data-source',
      text: 'default data source'
    },
    theme: {
      type: 'theme',
      'background-color': 'aliceblue',
      'text-color': 'dimgray'
    }
  };

  public jsonAsString!: string;
  public variablePairs: VariablePair[] = [
    { name: 'foo', value: 'variable text' },
    { name: 'bar', value: '3' },
    { name: 'baz', value: '1000' },
    { name: 'spanFields', value: 'id' }
  ];

  public dashboard?: Dashboard;
  public serializedDashboard?: object;
  public selectedWidget?: object;

  public constructor(private readonly modelChangedEvent: ModelChangedEventService) {}

  public ngOnInit(): void {
    // tslint:disable-next-line:no-null-keyword
    this.jsonAsString = JSON.stringify(this.json, null, 4);
  }

  public updateJson(): void {
    this.json = JSON.parse(this.jsonAsString);
    // tslint:disable-next-line:no-null-keyword
    this.jsonAsString = JSON.stringify(this.json, null, 4);
  }

  public setDashboard(dashboard: Dashboard): void {
    this.dashboard = dashboard;
    this.selectedWidget = dashboard.root;
    this.setVariables();
    this.modelChangedEvent.getObservableForModel(this.dashboard.root).subscribe(() => {
      this.serializedDashboard = dashboard.serialize();
    });
    this.serializedDashboard = dashboard.serialize();
  }

  public setVariables(): void {
    if (this.dashboard) {
      this.variablePairs.forEach(pair => this.updatePair(pair));
    }
  }

  public addVariable(): void {
    this.variablePairs.push({});
  }

  public removePair(pairToRemove: VariablePair): void {
    remove(this.variablePairs, pair => pair === pairToRemove);
  }

  public updatePair(pair: VariablePair): void {
    if (typeof pair.name !== 'string' || pair.name.length === 0) {
      return;
    }
    try {
      this.dashboard!.setVariable(pair.name, JSON.parse(pair.value!));
    } catch {
      this.dashboard!.setVariable(pair.name, pair.value);
    }
    // Replace to rerender
    this.variablePairs.splice(this.variablePairs.indexOf(pair), 1, { ...pair });
  }

  public onWidgetSelectionChange(obj: object): void {
    this.selectedWidget = obj;
  }

  public onClick(): void {
    // Nothing to do
  }
}

@Model({
  type: 'example-container'
})
export class ExampleContainer {
  @ModelProperty({
    key: 'children',
    type: 'array'
  })
  public readonly children: object[] = [];

  @ModelInject(MODEL_API)
  public api!: ModelApi;
}

@Model({
  type: 'example-model'
})
export class ExampleModel {
  @ModelProperty({
    key: 'title',
    type: STRING_PROPERTY.type,
    displayName: 'Title'
  })
  public readonly title!: string;

  @ModelInject(MODEL_API)
  public api!: ModelApi;

  public getData(): Observable<string> {
    return this.api.getData<unknown>().pipe(
      map(value => {
        if (typeof value === 'string') {
          return value;
        }

        // tslint:disable-next-line:no-null-keyword
        return JSON.stringify(value, null, 2);
      }),
      // tslint:disable-next-line:no-null-keyword
      catchError(err => of(JSON.stringify(err, null, 2)))
    );
  }
}
@Model({
  type: 'example-data-source'
})
export class ExampleDataSource implements DataSource<string> {
  public readonly dataSourceMarker: typeof dataSourceMarker = dataSourceMarker;

  @ModelProperty({
    key: 'text',
    type: STRING_PROPERTY.type
  })
  public readonly text?: string;

  @ModelProperty({
    key: 'exclamations',
    type: NUMBER_PROPERTY.type,
    required: false
  })
  public readonly exclamations: number = 1;

  @ModelProperty({
    key: 'rate',
    type: NUMBER_PROPERTY.type,
    required: false
  })
  public readonly rateMs: number = 1000;

  public getData(): Observable<string> {
    if (this.text !== undefined) {
      return interval(this.rateMs).pipe(
        take(this.exclamations + 1),
        map(sequenceNumber => `${this.text}${'!'.repeat(sequenceNumber)}`)
      );
    }

    return EMPTY;
  }
}

@Renderer({ modelClass: ExampleModel })
@Component({
  selector: 'app-example-renderer',
  template: `
    <div
      style="border: 1px solid black; padding: 4px;"
      [style.backgroundColor]="'background-color' | themeProp"
      [style.color]="'text-color' | themeProp"
    >
      <h4 [style.border]="'title-border' | themeProp">{{ api.model.title }}</h4>
      <div [style.border]="'content-border' | themeProp">
        <pre style="overflow-x: auto">{{ dataObservable | async }}</pre>
      </div>
    </div>
  `
})
export class ExampleRendererComponent implements OnInit {
  public dataObservable!: Observable<string>;

  public constructor(@Inject(RENDERER_API) public readonly api: RendererApi<ExampleModel>) {}

  public ngOnInit(): void {
    this.fetchData();
    this.api.change$.subscribe(() => this.fetchData());
  }

  private fetchData(): void {
    this.dataObservable = this.api.model.getData();
  }
}

@Renderer({ modelClass: ExampleContainer })
@Component({
  selector: 'app-example-container',
  template: `
    <div
      style="border: 1px solid black; padding: 4px;"
      [style.backgroundColor]="'background-color' | themeProp"
      [style.color]="'text-color' | themeProp"
    >
      <ng-container *ngFor="let child of api.model.children" [hdaDashboardModel]="child"> </ng-container>
    </div>
  `
})
export class ExampleContainerRendererComponent {
  public constructor(@Inject(RENDERER_API) public readonly api: RendererApi<ExampleContainer>) {}
}

@ModelPropertyEditor({
  propertyType: STRING_PROPERTY.type
})
@Component({
  selector: 'app-string-property-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h5>{{ label }}</h5>
    <input type="text" [(ngModel)]="currentValue" (keyup.enter)="propagateChange()" (focusout)="propagateChange()" />
  `
})
export class StringPropertyEditorComponent {
  public currentValue?: string;
  public readonly label: string;
  private lastPropagatedValue?: string;

  public constructor(@Inject(EDITOR_API) private readonly api: EditorApi<string | undefined>) {
    this.currentValue = api.value;
    this.lastPropagatedValue = this.currentValue;
    this.label = api.label;
  }

  public propagateChange(): void {
    if (this.currentValue === '') {
      this.currentValue = undefined; // Treat empty string as unset
    }

    if (this.lastPropagatedValue !== this.currentValue) {
      this.api.valueChange(this.currentValue);
      this.lastPropagatedValue = this.currentValue;
    }
  }
}

interface VariablePair {
  name?: string;
  value?: string;
}

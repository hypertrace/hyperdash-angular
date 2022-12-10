import { InjectionToken } from '@angular/core';
import { type EditorApi, type JsonPrimitive } from '@hypertrace/hyperdash';

export const EDITOR_API = new InjectionToken<EditorApi<JsonPrimitive>>('editor api');

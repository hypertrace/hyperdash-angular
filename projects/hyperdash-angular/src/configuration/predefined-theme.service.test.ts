import { PredefinedThemeService } from './predefined-theme.service';

describe('Predefined Theme Service', () => {
  let predefinedThemeService: PredefinedThemeService;

  beforeEach(() => {
    predefinedThemeService = new PredefinedThemeService();
  });

  test('creates dark theme', () => {
    expect(predefinedThemeService.getDarkTheme()).toEqual(expect.any(Object));
  });

  test('creates light theme', () => {
    expect(predefinedThemeService.getLightTheme()).toEqual(expect.any(Object));
  });

  test('created themes are fresh each time', () => {
    const firstDark = predefinedThemeService.getDarkTheme();
    firstDark.backgroundColor = 'NEW COLOR';

    expect(predefinedThemeService.getDarkTheme()).not.toMatchObject(firstDark);
  });
});

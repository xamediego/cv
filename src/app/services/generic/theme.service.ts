import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private darkThemeClass = 'dark-theme';
  private lightThemeClass = 'light-theme';

  constructor() {
    const saved = localStorage.getItem('theme');

    if (saved) {
      // @ts-ignore
      this.setTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  setTheme(mode: 'dark' | 'light') {
    document.body.classList.remove(this.darkThemeClass, this.lightThemeClass);
    document.body.classList.add(mode === 'dark' ? this.darkThemeClass : this.lightThemeClass);

    localStorage.setItem('theme', mode);
  }

  toggleTheme() {
    const isDark = document.body.classList.contains(this.darkThemeClass);
    this.setTheme(isDark ? 'light' : 'dark');
  }

  get currentTheme(): 'dark' | 'light' {
    return document.body.classList.contains(this.darkThemeClass) ? 'dark' : 'light';
  }
}

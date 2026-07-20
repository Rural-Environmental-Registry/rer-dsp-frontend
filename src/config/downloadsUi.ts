export const MAX_DOWNLOAD_LEVEL1 = 5

export const downloadsUiConfig = {
  bannerTitle: 'Downloads',
  level1Title: 'Select the level 1 you want to access for Downloads',
  level2Title: 'Options for the selected level 1',
  filterByTitle: 'Filter by:',
  level3Label: 'Level 3',
  level3Placeholder: 'Select level 3',
  themeLabel: 'Theme',
  themePlaceholder: 'All themes',
  searchButton: 'Search',
  clearButton: 'Clear',
  noResultsMessage: 'No themes found for the selected filter.',
  columns: {
    topic: 'Theme',
    services: 'Services',
    lastUpdate: 'Last update',
  },
  emptyValue: '—',
  formatLabels: {
    csv: 'CSV',
  } as Record<string, string>,
  statusTitles: {
    available: 'Download',
    unavailable: 'File unavailable',
    coming_soon: 'Coming soon',
  } as Record<string, string>,
}

export function formatDownloadLabel(format: string): string {
  return downloadsUiConfig.formatLabels[format] ?? format.toUpperCase()
}

export type AboutTabId = 'overview' | 'how-to-use' | 'configuration' | 'license'

export interface AboutSection {
  title?: string
  paragraphs?: string[]
  bullets?: string[]
  note?: string
}

export interface AboutTab {
  id: AboutTabId
  label: string
  sections: AboutSection[]
}

export const aboutUiConfig = {
  bannerTitle: 'About',
  defaultTabId: 'overview' as AboutTabId,
  tabs: [
    {
      id: 'overview',
      label: 'Overview',
      sections: [
        {
          paragraphs: [
            'The Data Sharing Platform (DSP) is a Digital Public Good (DPG) for public geospatial consultation. It helps governments and organizations publish, explore, and download registered spatial data in a transparent and reusable way.',
          ],
        },
        {
          title: 'What you can do',
          bullets: [
            'Browse registered data using a configurable geographic hierarchy.',
            'Search records by identifier and view key details.',
            'Download theme-based files for selected locations.',
            'Adapt labels, themes, and KPIs to local needs.',
          ],
        },
      ],
    },
    {
      id: 'how-to-use',
      label: 'How to use',
      sections: [
        {
          title: 'Home',
          paragraphs: [
            'Use Level 2 and Level 3 filters to narrow the data, or enter an identifier to open the record details panel. KPI cards summarize the current selection.',
          ],
          bullets: [
            'Select Level 2 (required for location search).',
            'Optionally select Level 3 for a more specific result.',
            'Or enter an Identifier and click Search to open details.',
          ],
        },
        {
          title: 'Downloads',
          paragraphs: [
            'Choose Level 1, then Level 2. Level 3 and Theme filters appear after Level 2 is selected. Available formats (for example CSV) are listed per theme.',
          ],
          bullets: [
            'Click a Level 1 chip to reveal Level 2 options.',
            'Click a Level 2 chip to load themes and optional filters.',
            'Use Search after changing Level 3 or Theme.',
            'Download only formats marked as available.',
          ],
        },
      ],
    },
    {
      id: 'configuration',
      label: 'Configuration',
      sections: [
        {
          paragraphs: [
            'DSP is designed to be configured by adopters. Labels, hierarchy depth, themes, and KPIs can be adjusted without rewriting the core product.',
          ],
        },
        {
          title: 'Already configurable in this version',
          bullets: [
            'Hierarchy labels (Level 1, Level 2, Level 3) and which levels appear on each screen.',
            'Home KPIs (1 to 5 cards).',
            'Detail panel fields and labels for identifier search.',
            'Download themes and available file formats (catalog).',
          ],
        },
        {
          note: 'Detailed adopter guides will be added as configuration options mature. For now, defaults live in the frontend/backend configuration modules.',
        },
      ],
    },
    {
      id: 'license',
      label: 'License',
      sections: [
        {
          paragraphs: [
            'This project is part of the Rural Environmental Registry (RER) ecosystem and is intended as a Digital Public Good.',
            'The software is licensed under the GNU General Public License v3.0 (GPL-3.0).',
          ],
          bullets: [
            'You may use, study, share, and improve the software under the terms of the GPL-3.0.',
            'Contributions and deployments should keep license notices intact.',
          ],
        },
        {
          note: 'See the LICENSE file in the project repository for the full legal text.',
        },
      ],
    },
  ] satisfies AboutTab[],
}

export function getAboutTabById(
  id: string | null | undefined,
  config = aboutUiConfig,
): AboutTab {
  const match = config.tabs.find((tab) => tab.id === id)
  return match ?? config.tabs.find((tab) => tab.id === config.defaultTabId) ?? config.tabs[0]
}

export function isAboutTabId(value: string | null | undefined): value is AboutTabId {
  return aboutUiConfig.tabs.some((tab) => tab.id === value)
}

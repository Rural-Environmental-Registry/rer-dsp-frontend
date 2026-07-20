import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DetailSearchComponent from '@/components/DetailSearchComponent.vue'
import type { DetailByIdentifierDTO } from '@/types/totalizer'
import { detailByIdentifierConfig } from '@/config/detailByIdentifier'
import { hierarchyFieldsByKey, homeSearchConfig } from '@/config/searchHierarchy'

const detail: DetailByIdentifierDTO = {
  codeProperty: 'DF123456789012',
  createdAt: '10/01/2020',
  nameCity: 'Brasília',
  nameState: 'Distrito Federal',
  latitude: '-15.793889',
  longitude: '-47.882778',
  geographicCoordinatesOfCentroid: '-15.793889, -47.882778',
  haRegisteredArea: 120.5,
  fiscalModules: 2.5,
  lastRectification: '15/06/2024',
}

describe('DetailSearchComponent', () => {
  it('should render section titles and main values from config', () => {
    const wrapper = mount(DetailSearchComponent, {
      props: { detail },
    })

    expect(wrapper.text()).toContain(detailByIdentifierConfig.sectionTitle)
    expect(wrapper.text()).toContain(detailByIdentifierConfig.propertySectionTitle)
    expect(wrapper.text()).toContain('DF123456789012')
    expect(wrapper.text()).toContain('Brasília')
    expect(wrapper.text()).toContain('Distrito Federal')
    expect(wrapper.text()).toContain('120.50 ha')
  })

  it('should use the same generic labels as the home search filters', () => {
    const wrapper = mount(DetailSearchComponent, {
      props: { detail },
    })

    expect(wrapper.text()).toContain(homeSearchConfig.identifier?.label)
    expect(wrapper.text()).toContain(hierarchyFieldsByKey.level2.label)
    expect(wrapper.text()).toContain(hierarchyFieldsByKey.level3.label)
    expect(wrapper.text()).toContain('Level 2')
    expect(wrapper.text()).toContain('Level 3')
    expect(wrapper.text()).toContain('Identifier')
    expect(wrapper.text()).not.toContain('UF')
    expect(wrapper.text()).not.toContain('Municipality')
    expect(wrapper.text()).not.toContain('Nº do CAR')
  })

  it('should show alteration date and hide centroid and fiscal modules', () => {
    const wrapper = mount(DetailSearchComponent, {
      props: { detail },
    })

    expect(wrapper.text()).toContain('Alteration date')
    expect(wrapper.text()).toContain('15/06/2024')
    expect(wrapper.text()).not.toContain('Centroid coordinates')
    expect(wrapper.text()).not.toContain('Reference modules')
    expect(wrapper.text()).not.toContain('-15.793889, -47.882778')
    expect(wrapper.text()).not.toContain('2.50')
  })

  it('should render property fields in separate rows', () => {
    const wrapper = mount(DetailSearchComponent, {
      props: { detail },
    })

    const rows = wrapper.findAll('.property-row')
    expect(rows).toHaveLength(3)
    expect(rows[0].text()).toContain('Level 3')
    expect(rows[0].text()).toContain('Level 2')
    expect(rows[1].text()).toContain('Latitude')
    expect(rows[1].text()).toContain('Longitude')
    expect(rows[2].text()).toContain('Area')
  })

  it('should render features download button disabled', () => {
    const wrapper = mount(DetailSearchComponent, {
      props: { detail },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain(detailByIdentifierConfig.featuresDownload.label)
    expect(button.attributes('disabled')).toBeDefined()
  })
})

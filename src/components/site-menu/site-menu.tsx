import { Component, Prop, ComponentInterface, h, State } from '@stencil/core'
import SiteProviderConsumer, {
  SiteState
} from '../../global/site-provider-consumer'
import { SiteStructureItem } from '../../global/definitions'

@Component({
  tag: 'site-menu',
  styleUrl: 'site-menu.css'
})
export class SiteMenu implements ComponentInterface {
  @Prop() siteStructureList: SiteStructureItem[] = []
  @Prop({ mutable: true }) selectedParent: SiteStructureItem = null

  @State() query: string = ''
  @State() filteredList: SiteStructureItem[] = []
  toggleParent = (parentItem: SiteStructureItem) => {
    return (e: MouseEvent) => {
      e.preventDefault()
      this.selectedParent = parentItem
    }
  }
  onSearchInput(e) {
    this.query = e.target.value
    this.filteredList = this.siteStructureList.map(item => {
      const filteredChildren = item.children.filter(childItem => {
        return childItem.text
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      })
      return {
        ...item,
        children: [...filteredChildren]
      }
    })
  }

  render() {
    return (
      <div class='sticky'>
        <SiteProviderConsumer.Consumer>
          {({ toggleLeftSidebar }: SiteState) => (
            <div>
              <div class='search-container'>
                <input
                  id='search-input'
                  type='search'
                  placeholder='Search'
                  onInput={e => this.onSearchInput(e)}
                />
              </div>
              {this.query.length > 0 ? (
                <ul class='menu-list'>
                  {this.filteredList.map(item =>
                    item.children.length > 0 ? (
                      <li>
                        <a
                          href={item.children[0].url || '#'}
                          onClick={this.toggleParent(item)}>
                          <span class='section-label'>{item.text}</span>
                        </a>
                        <ul>
                          {item.children.map(childItem => (
                            <li>
                              {childItem.url ? (
                                <stencil-route-link
                                  url={childItem.url}
                                  onClick={toggleLeftSidebar}>
                                  {childItem.text}
                                </stencil-route-link>
                              ) : (
                                <a
                                  rel='noopener'
                                  class='link--external'
                                  target='_blank'
                                  href={childItem.filePath}>
                                  {childItem.text}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : null
                  )}
                </ul>
              ) : (
                <ul class='menu-list'>
                  {this.siteStructureList.map(item => (
                    <li>
                      <a
                        href={item.children[0].url || '#'}
                        onClick={this.toggleParent(item)}>
                        <span class='section-label'>{item.text}</span>
                      </a>
                      <ul class={{ collapsed: item !== this.selectedParent }}>
                        {item.children.map(childItem => (
                          <li>
                            {childItem.url ? (
                              <stencil-route-link
                                url={childItem.url}
                                onClick={toggleLeftSidebar}>
                                {childItem.text}
                              </stencil-route-link>
                            ) : (
                              <a
                                rel='noopener'
                                class='link--external'
                                target='_blank'
                                href={childItem.filePath}>
                                {childItem.text}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </SiteProviderConsumer.Consumer>
      </div>
    )
  }
}

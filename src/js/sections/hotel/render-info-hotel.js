import { updateTextContent } from '@/js/utils/update-text-content.js';

export function renderInfoHotel(info) {
  const features= info.features || [];
  const container = document.querySelector('[data-info="hotel"]');
  if (!container) return;

  const elements = {
    title: container.querySelector('[data-info="title"]'),
    desc: container.querySelector('[data-info="text"]'),
    wrapper: container.querySelector('[data-info="lists-container"]'),
    template: container.querySelector('[data-info-template]'),
  }

  updateTextContent(elements.title, info.mainDescription);
  updateTextContent(elements.desc, info.description);

  const block = elements.template.content.querySelector('[data-info="list-block"]');
  const listItem = elements.template.content.querySelector('li');

  const blockFragment = document.createDocumentFragment();
  features.forEach(item => {
    const cloneBlock = block.cloneNode(true);
    const list = cloneBlock.querySelector('[data-info="list"]')
    const title = cloneBlock.querySelector('[data-info="list-title"]');

    if (!list) return;

    updateTextContent(title, item.title?.trim());

    const entries  = item.entries || [];

    entries.forEach(text  => {
      const cloneItem = listItem.cloneNode(true);
      updateTextContent(cloneItem, text.trim());

      list.append(cloneItem);
    })

    blockFragment.append(cloneBlock);
  })

  elements.wrapper.append(blockFragment);
}
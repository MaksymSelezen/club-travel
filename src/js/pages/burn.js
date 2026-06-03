import '@/js/layout/burger-menu.js';
import '@/js/layout/header-account-dropdown.js';
import '@/js/layout/header-scroll-state.js';

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. ВІДКРИТИ / ЗАКРИТИ outer row ────────────────────────
    document.querySelectorAll('.btn-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('.tour-row');
            const panel = row.querySelector('.tour-row__panel');
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            btn.setAttribute('aria-expanded', String(!isOpen));
            btn.querySelector('.btn-toggle__label').textContent = isOpen ? 'ОТКРЫТЬ' : 'ЗАКРЫТЬ';
            panel.hidden = isOpen;
            row.classList.toggle('is-open', !isOpen);
        });
    });

    // ── 2. ОТКРЫТЬ / СКРЫТЬ ПРЕДЛОЖЕНИЯ ────────────────────────
    document.querySelectorAll('.btn-offers').forEach(btn => {
        btn.addEventListener('click', () => {
            const innerRow = btn.closest('.inner-row--expandable');
            const subRows = innerRow.querySelector('.sub-rows');
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            btn.setAttribute('aria-expanded', String(!isOpen));
            btn.querySelector('.btn-offers__label').textContent =
                isOpen ? 'ОТКРЫТЬ ПРЕДЛОЖЕНИЯ' : 'СКРЫТЬ ПРЕДЛОЖЕНИЯ';
            subRows.hidden = isOpen;
            innerRow.classList.toggle('is-open', !isOpen);
        });
    });

});

window.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('btn-export-tips-pdf');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', () => {
        const originalContent = exportBtn.innerHTML;
        exportBtn.disabled = true;
        exportBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-2 text-gold inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generant PDF...
        `;

        const tipCards = document.querySelectorAll('#tips .tip-card');
        let tipsHTML = '';

        tipCards.forEach(card => {
            const pMain = card.querySelector('p:not(.tip-subtext)');
            if (!pMain) return;

            const numSpan = pMain.querySelector('.tip-number');
            const tipNumber = numSpan ? numSpan.innerText.trim() : '#:';

            const pMainClone = pMain.cloneNode(true);
            const clonedSpan = pMainClone.querySelector('.tip-number');
            if (clonedSpan) {
                pMainClone.removeChild(clonedSpan);
            }
            const mainText = pMainClone.innerText.trim();

            const subtextEl = card.querySelector('.tip-subtext');
            const subtext = subtextEl ? subtextEl.innerText.trim() : null;

            // Disseny de card apte per impressió estalviant tinta
            tipsHTML += `
                <div class="pdf-tip-card" style="display: block; box-sizing: border-box; border: 1px solid rgba(212, 175, 55, 0.3); background-color: rgba(212, 175, 55, 0.04); padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">
                    <p style="margin: 0; font-size: 13px; font-weight: 600; color: #111827; line-height: 1.5;">
                        <span style="color: #d4af37; font-weight: 700; margin-right: 4px;">${tipNumber}</span> ${mainText}
                    </p>
                    ${subtext ? `
                    <p style="margin: 6px 0 0 0; font-size: 11px; font-style: italic; color: #4b5563; padding-left: 12px; border-left: 2px solid #d4af37; line-height: 1.4;">
                        ${subtext}
                    </p>
                    ` : ''}
                </div>
            `;
        });

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.innerHTML = `
            <div id="pdf-content" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px 45px 30px 45px; color: #1f2937; background-color: #ffffff; width: 794px; box-sizing: border-box; margin: 0">
                <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 16px; margin-bottom: 24px;">
                    <h1 style="color: #111827; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: 4px;">G R U P&nbsp;&nbsp;&nbsp;D ' E L I T</h1>
                    <!--<p style="font-size: 10px; font-style: italic; color: #6b7280; margin: 6px 0 0 0; letter-spacing: 0.5px;">"només per ús intern del grup d'elit, no compartir amb els de fora"</p>-->
                    <h2 style="color: #d4af37; font-size: 16px; font-weight: 700; margin: 12px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Llista de tips</h2>
                </div>
                <div style="display: block;">
                    ${tipsHTML}
                </div>
                <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center; font-size: 9px; color: #9ca3af;">
                    <p>© 2026. Com diu el T I P 41, no compartir els tips a la gent de fora</p>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        const opt = {
            // Marge superior i inferior a 12mm. Els marges laterals es controlen amb el padding del contenidor (45px) per evitar que el text es talli.
            margin: [12, 0, 12, 0],
            filename: 'tips.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'], avoid: '.pdf-tip-card' }
        };

        html2pdf().set(opt).from(container.querySelector('#pdf-content')).save().then(() => {
            document.body.removeChild(container);
            exportBtn.innerHTML = originalContent;
            exportBtn.disabled = false;
        }).catch(err => {
            console.error('Error generating PDF:', err);
            alert('Hi ha hagut un error generant el PDF. Si us plau, torna-ho a intentar.');
            exportBtn.innerHTML = originalContent;
            exportBtn.disabled = false;
        });
    });
});

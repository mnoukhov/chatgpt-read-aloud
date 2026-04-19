(function () {
  "use strict";

  const readAloudSVG = '<path d="M9.75122 4.09203C9.75122 3.61482 9.21964 3.35044 8.84399 3.60277L8.77173 3.66039L6.55396 5.69262C6.05931 6.14604 5.43173 6.42255 4.7688 6.48461L4.48267 6.49828C3.52474 6.49851 2.74829 7.27565 2.74829 8.23363V11.7668C2.74829 12.7248 3.52474 13.501 4.48267 13.5012C5.24935 13.5012 5.98874 13.7889 6.55396 14.3069L8.77173 16.3401L8.84399 16.3967C9.21966 16.6493 9.75122 16.3858 9.75122 15.9084V4.09203ZM17.2483 10.0002C17.2483 8.67623 16.9128 7.43233 16.3235 6.34691L17.4924 5.71215C18.1849 6.9875 18.5784 8.4491 18.5784 10.0002C18.5783 11.5143 18.2033 12.9429 17.5413 14.1965C17.3697 14.5212 16.9675 14.6453 16.6428 14.4739C16.3182 14.3023 16.194 13.9001 16.3655 13.5754C16.9288 12.5086 17.2483 11.2927 17.2483 10.0002ZM13.9182 10.0002C13.9182 9.1174 13.6268 8.30445 13.135 7.64965L14.1985 6.85082C14.8574 7.72804 15.2483 8.81952 15.2483 10.0002L15.2336 10.3938C15.166 11.3044 14.8657 12.1515 14.3918 12.8743L14.3069 12.9797C14.0889 13.199 13.7396 13.2418 13.4709 13.0657C13.164 12.8643 13.0784 12.4528 13.2795 12.1457L13.4231 11.9084C13.6935 11.4246 13.8643 10.8776 13.9075 10.2942L13.9182 10.0002ZM13.2678 6.71801C13.5615 6.49772 13.978 6.55727 14.1985 6.85082L13.135 7.64965C12.9144 7.35599 12.9742 6.93858 13.2678 6.71801ZM16.5911 5.44555C16.9138 5.27033 17.3171 5.38949 17.4924 5.71215L16.3235 6.34691C16.1483 6.02419 16.2684 5.62081 16.5911 5.44555ZM11.0813 15.9084C11.0813 17.5226 9.22237 18.3912 7.9895 17.4202L7.87231 17.3205L5.65552 15.2873C5.33557 14.9941 4.91667 14.8313 4.48267 14.8313C2.7902 14.8311 1.41821 13.4594 1.41821 11.7668V8.23363C1.41821 6.54111 2.7902 5.16843 4.48267 5.1682L4.64478 5.16039C5.02003 5.12526 5.37552 4.96881 5.65552 4.71215L7.87231 2.67992L7.9895 2.58031C9.22237 1.60902 11.0813 2.47773 11.0813 4.09203V15.9084Z"></path>';
  const stopSVG = '<path d="M10 2.08496C14.3713 2.08496 17.915 5.62867 17.915 10C17.915 14.3713 14.3713 17.915 10 17.915C5.62867 17.915 2.08496 14.3713 2.08496 10C2.08496 5.62867 5.62867 2.08496 10 2.08496ZM8.25 7.25C7.69772 7.25 7.25 7.69772 7.25 8.25V11.75C7.25 12.3023 7.69772 12.75 8.25 12.75H11.75C12.3023 12.75 12.75 12.3023 12.75 11.75V8.25C12.75 7.69772 12.3023 7.25 11.75 7.25H8.25Z"></path>';
  const pauseSVG = '<path d="M10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3ZM9 13H7V7H9V13ZM13 13H11V7H13V13Z"></path>';
  const STORAGE_KEY = 'autoPlayEnabled';
  const HIDE_FEEDBACK_STORAGE_KEY = 'hideFeedbackButtonsEnabled';
  const hasStorage = typeof chrome !== 'undefined' && chrome?.storage?.sync;
  let autoPlayEnabled = false;
  let autoPlayArmedForNewResponses = false;
  let hideFeedbackButtonsEnabled = false;

  function hideFeedbackButtons() {
    if (!hideFeedbackButtonsEnabled) {
      return;
    }

    const goodResponseButtons = document.querySelectorAll('button[aria-label="Good response"]');
    const badResponseButtons = document.querySelectorAll('button[aria-label="Bad response"]');

    goodResponseButtons.forEach((button) => {
      button.dataset.readAloudFeedbackHidden = 'true';
      button.style.display = 'none';
    });
    badResponseButtons.forEach((button) => {
      button.dataset.readAloudFeedbackHidden = 'true';
      button.style.display = 'none';
    });
  }

  function restoreFeedbackButtons() {
    const hiddenFeedbackButtons = document.querySelectorAll('button[data-read-aloud-feedback-hidden="true"]');
    hiddenFeedbackButtons.forEach((button) => {
      button.style.removeProperty('display');
      delete button.dataset.readAloudFeedbackHidden;
    });
  }

  function setHideFeedbackButtonsEnabled(value) {
    hideFeedbackButtonsEnabled = Boolean(value);
    if (hideFeedbackButtonsEnabled) {
      hideFeedbackButtons();
    } else {
      restoreFeedbackButtons();
    }
  }

  function triggerAutoPlayForButton(proxyButton) {
    if (
      !autoPlayEnabled ||
      !proxyButton ||
      proxyButton.dataset.autoPlayTriggered === 'true' ||
      proxyButton.dataset.autoPlayEligible !== 'true'
    ) {
      return;
    }

    if (proxyButton.getAttribute('aria-label') !== 'Read Aloud') {
      return;
    }

    proxyButton.dataset.autoPlayTriggered = 'true';
    autoPlayArmedForNewResponses = false;

    setTimeout(() => {
      if (proxyButton.isConnected && autoPlayEnabled) {
        proxyButton.click();
      }
    }, 100);
  }

  function triggerAutoPlayForExisting() {
    if (!autoPlayEnabled) {
      return;
    }

    const proxyButtons = document.querySelectorAll('button[data-read-aloud-proxy="true"]');
    for (const button of proxyButtons) {
      if (
        button.dataset.autoPlayTriggered !== 'true' &&
        button.dataset.autoPlayEligible === 'true' &&
        button.getAttribute('aria-label') === 'Read Aloud'
      ) {
        triggerAutoPlayForButton(button);
        break;
      }
    }
  }

  function resetProxyButtonAppearance(button) {
    if (!button) {
      return;
    }
    button.setAttribute('aria-label', 'Read Aloud');
    button.dataset.autoPlayTriggered = 'false';
    button.dataset.autoPlayEligible = 'false';
    const icon = button.querySelector('svg');
    if (icon) {
      icon.innerHTML = readAloudSVG;
    }
  }

  function resetAllProxyButtons() {
    const proxyButtons = document.querySelectorAll('button[data-read-aloud-proxy="true"]');
    for (const button of proxyButtons) {
      resetProxyButtonAppearance(button);
    }
  }

  function setAutoPlayEnabled(value) {
    autoPlayEnabled = Boolean(value);
    if (autoPlayEnabled) {
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(triggerAutoPlayForExisting, { timeout: 500 });
      } else {
        setTimeout(triggerAutoPlayForExisting, 200);
      }
    }
  }

  function initializeAutoPlaySetting() {
    if (!hasStorage) {
      autoPlayEnabled = false;
      return;
    }

    chrome.storage.sync.get({ [STORAGE_KEY]: false, [HIDE_FEEDBACK_STORAGE_KEY]: false }, (result) => {
      setAutoPlayEnabled(result[STORAGE_KEY]);
      setHideFeedbackButtonsEnabled(result[HIDE_FEEDBACK_STORAGE_KEY]);
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync' && Object.prototype.hasOwnProperty.call(changes, STORAGE_KEY)) {
        setAutoPlayEnabled(changes[STORAGE_KEY].newValue);
      }

      if (areaName === 'sync' && Object.prototype.hasOwnProperty.call(changes, HIDE_FEEDBACK_STORAGE_KEY)) {
        setHideFeedbackButtonsEnabled(changes[HIDE_FEEDBACK_STORAGE_KEY].newValue);
      }
    });
  }

  function isInComposer(target) {
    if (!(target instanceof Element)) {
      return false;
    }

    return Boolean(target.closest('textarea, [contenteditable="true"]'));
  }

  function isSendButton(target) {
    if (!(target instanceof Element)) {
      return false;
    }

    const sendButton = target.closest('button[aria-label*="Send"], button[data-testid*="send"]');
    return Boolean(sendButton && !sendButton.disabled && sendButton.getAttribute('aria-disabled') !== 'true');
  }

  function armAutoPlayForNewResponses() {
    autoPlayArmedForNewResponses = true;
  }

  function temporarilyHideMenu() {
    const menu = document.querySelector('div[role="menu"]');
    if (!menu || menu.dataset.proxyMenuHidden === 'true') {
      return null;
    }

    const recordedStyles = {
      opacity: {
        value: menu.style.getPropertyValue('opacity'),
        priority: menu.style.getPropertyPriority('opacity'),
      },
      pointerEvents: {
        value: menu.style.getPropertyValue('pointer-events'),
        priority: menu.style.getPropertyPriority('pointer-events'),
      },
      transform: {
        value: menu.style.getPropertyValue('transform'),
        priority: menu.style.getPropertyPriority('transform'),
      },
    };

    menu.dataset.proxyMenuHidden = 'true';
    menu.style.setProperty('opacity', '0', 'important');
    menu.style.setProperty('pointer-events', 'none', 'important');
    menu.style.setProperty('transform', 'translate(-9999px, -9999px)', 'important');

    return () => {
      if (!menu.isConnected) {
        delete menu.dataset.proxyMenuHidden;
        return;
      }

      const restoreProperty = (property, record) => {
        if (record.value) {
          menu.style.setProperty(property, record.value, record.priority || '');
        } else {
          menu.style.removeProperty(property);
        }
      };

      restoreProperty('opacity', recordedStyles.opacity);
      restoreProperty('pointer-events', recordedStyles.pointerEvents);
      restoreProperty('transform', recordedStyles.transform);
      delete menu.dataset.proxyMenuHidden;
    };
  }

  function createProxyButton() {
    const moreActionsButtons = document.querySelectorAll('button[aria-label="More actions"]:not([data-proxy-added])');

    for (const moreActionsButton of moreActionsButtons) {
      moreActionsButton.dataset.proxyAdded = 'true';

      const container = moreActionsButton.parentElement;
      if (!container) continue;
      const proxyButton = moreActionsButton.cloneNode(true);
      proxyButton.setAttribute('aria-label', 'Read Aloud');
      proxyButton.dataset.readAloudProxy = 'true';
      proxyButton.dataset.autoPlayTriggered = 'false';
      proxyButton.dataset.autoPlayEligible = autoPlayArmedForNewResponses ? 'true' : 'false';
      
      const icon = proxyButton.querySelector('svg');
      if (icon) {
        icon.innerHTML = readAloudSVG;
      }

      (function(specificMoreActionsButton) {
        proxyButton.addEventListener('click', (event) => {
          event.stopPropagation();

          const currentState = proxyButton.getAttribute('aria-label');
          let restoreMenuStyles = null;

          const openMenu = () => {
            specificMoreActionsButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, view: window }));
            specificMoreActionsButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, view: window }));
          };

          const scheduleMenuHide = () => {
            if (!restoreMenuStyles) {
              const restore = temporarilyHideMenu();
              if (typeof restore === 'function') {
                restoreMenuStyles = restore;
              }
            }
          };

          const runRestoreMenu = () => {
            if (restoreMenuStyles) {
              restoreMenuStyles();
              restoreMenuStyles = null;
            }
          };

          if (currentState === 'Read Aloud') {
            openMenu();
            
            requestAnimationFrame(() => {
              scheduleMenuHide();
              setTimeout(scheduleMenuHide, 50);
            });

            const clickReadAloudWhenReady = (attemptsRemaining) => {
              scheduleMenuHide();
              // Old selector kept for rollback reference; clicking "Loading" can mark playback as stopped/started incorrectly.
              // const realReadAloudButton = document.querySelector('div[role="menuitem"][aria-label="Read aloud"], div[role="menuitem"][aria-label="Loading"]');
              const realReadAloudButton = document.querySelector('div[role="menuitem"][aria-label="Read aloud"]');
              if (realReadAloudButton) {
                realReadAloudButton.click();
                proxyButton.setAttribute('aria-label', 'Stop');
                const icon = proxyButton.querySelector('svg');
                if (icon) {
                  icon.innerHTML = stopSVG;
                }
                openMenu();
                setTimeout(runRestoreMenu, 100);
              } else {
                if (attemptsRemaining > 0) {
                  setTimeout(() => clickReadAloudWhenReady(attemptsRemaining - 1), 200);
                } else {
                  runRestoreMenu();
                }
              }
            };

            setTimeout(() => clickReadAloudWhenReady(5), 300);
          } else {
            openMenu();
            
            requestAnimationFrame(() => {
              scheduleMenuHide();
              setTimeout(scheduleMenuHide, 50);
            });

            setTimeout(() => {
              scheduleMenuHide();
              const stopButton = document.querySelector('div[role="menuitem"][aria-label="Stop"]');
              if (stopButton) {
                stopButton.click();
                resetProxyButtonAppearance(proxyButton);
                proxyButton.dataset.autoPlayEligible = 'false';
                openMenu();
                setTimeout(runRestoreMenu, 100);
              } else {
                runRestoreMenu();
              }
            }, 300);
          }
        });
      })(moreActionsButton);

      if (autoPlayEnabled) {
        setTimeout(() => triggerAutoPlayForButton(proxyButton), 0);
      }

      moreActionsButton.before(proxyButton);
    }
  }

  let mutationTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(mutationTimer);
    mutationTimer = setTimeout(() => {
      createProxyButton();
      hideFeedbackButtons();
      if (autoPlayEnabled) {
        triggerAutoPlayForExisting();
      }
    }, 150);
  });

  document.addEventListener('ended', (event) => {
    const target = event.target;
    if (target instanceof HTMLAudioElement) {
      resetAllProxyButtons();
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      isInComposer(event.target)
    ) {
      armAutoPlayForNewResponses();
    }
  }, true);

  document.addEventListener('pointerdown', (event) => {
    if (isSendButton(event.target)) {
      armAutoPlayForNewResponses();
    }
  }, true);

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'toggleAutoPlay') {
      setAutoPlayEnabled(request.enabled);
    }
    setTimeout(hideFeedbackButtons, 500);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  initializeAutoPlaySetting();
  setTimeout(() => {
    createProxyButton();
    hideFeedbackButtons();
  }, 500);

})();

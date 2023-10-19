(function() {
    const refreshInterval = 20000;
    const ignoredTicketIds = new Set();
  
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function clearIgnoredTickets() {
        ignoredTicketIds.clear();
        lastNotifiedTicketCount = 0;

    }
  
    async function mainLogic() {
      const listWrapper = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-primary-content > sn-ux-content-option:nth-child(3) > sn-workspace-list-module");
      const ticketRows = listWrapper.shadowRoot.querySelector("div > div.list-wrapper > now-record-list-connected").shadowRoot.querySelector("div > now-record-list").shadowRoot.querySelector("div > div.sn-list-grid-container > div > div > now-grid").shadowRoot.querySelector("div > table > tbody").rows;
  
      await delay(800);
  
      const nonIgnoredTickets = Array.from(ticketRows).filter(ticketRow => {
        const ticketId = ticketRow.cells[2].innerText;
        return !ignoredTicketIds.has(ticketId);
      });
  
      const nonIgnoredTicketCount = nonIgnoredTickets.length;
      console.log(nonIgnoredTicketCount);
  
      if (nonIgnoredTicketCount > 0) {
        nonIgnoredTickets.forEach(ticketRow => {
          const ticketId = ticketRow.cells[2].innerText;
          ignoredTicketIds.add(ticketId);
        });
  
        const notificationMessage = `${nonIgnoredTicketCount} new ticket(s)`;
  
        if (Notification.permission === "granted") {
          const notification = new Notification("Ticket Notification", {
            body: notificationMessage,
            requireInteraction: true // Requires user interaction to remove notification
          });
  
          notification.onclick = () => {
            // Handle click event if needed
          };
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              const notification = new Notification("Ticket Notification", {
                body: notificationMessage,
                requireInteraction: false
              });
  
              notification.onclick = () => {
                // Handle click event if needed
              };
            }
          });
        }
      }
    }
  
    function refreshAndNotify() {
      const refreshButton = listWrapper.shadowRoot.querySelector("div > div.list-wrapper > now-record-list-connected").shadowRoot.querySelector("div > now-record-list").shadowRoot.querySelector("div > div.sn-list-header > sn-record-list-declarative-actions-wrapper").shadowRoot.querySelector("sn-record-list-header-toolbar").shadowRoot.querySelector("div.sn-list-header-toolbar > div.sn-record-list-header-toolbar-button-refresh.-md > div > now-button").shadowRoot.querySelector("button");
      
      refreshButton.click();
      setTimeout(mainLogic, 800); // Wait for the refreshed data before checking and showing notifications
    }
  
    const listWrapper = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-primary-content > sn-ux-content-option:nth-child(3) > sn-workspace-list-module");
    setInterval(refreshAndNotify, refreshInterval);
    setTimeout(clearIgnoredTickets, 300000);
  })();
  

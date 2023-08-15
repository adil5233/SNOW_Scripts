(function() {
    const refreshInterval = 40000;
    const ignoredTicketIds = new Set();
    let lastNotifiedTicketCount = 0;
  
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function clearIgnoredTickets() {
        ignoredTicketIds.clear();
    }
  
    async function mainLogic() {
      const listWrapper = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-primary-content > sn-ux-content-option:nth-child(3) > sn-workspace-list-module");
      const refreshButton = listWrapper.shadowRoot.querySelector("div > div.list-wrapper > now-record-list-connected").shadowRoot.querySelector("div > now-record-list").shadowRoot.querySelector("div > div.sn-list-header > sn-record-list-declarative-actions-wrapper").shadowRoot.querySelector("sn-record-list-header-toolbar").shadowRoot.querySelector("div.sn-list-header-toolbar > div.sn-record-list-header-toolbar-button-refresh.-md > div > now-button").shadowRoot.querySelector("button");
      const ticketRows = listWrapper.shadowRoot.querySelector("div > div.list-wrapper > now-record-list-connected").shadowRoot.querySelector("div > now-record-list").shadowRoot.querySelector("div > div.sn-list-grid-container > div > div > now-grid").shadowRoot.querySelector("div > table > tbody").rows;
  
      await delay(800);
      refreshButton.click();
  
      await delay(800);
      const totalRows = ticketRows.length;
      console.log(totalRows);
  
      if (totalRows > 0) {
        const nonIgnoredTickets = Array.from(ticketRows).filter(ticketRow => {
          const ticketId = ticketRow.cells[2].innerText;
          return !ignoredTicketIds.has(ticketId);
        });
  
        const nonIgnoredTicketCount = nonIgnoredTickets.length;
        console.log(nonIgnoredTicketCount);
  
        if (nonIgnoredTicketCount > 0 && nonIgnoredTicketCount > lastNotifiedTicketCount) {
          lastNotifiedTicketCount = nonIgnoredTicketCount;
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
                  requireInteraction: true
                });
  
                notification.onclick = () => {
                  // Handle click event if needed
                };
              }
            });
          }
        }
      }
    }
  
    setInterval(mainLogic, refreshInterval);
    setTimeout(clearIgnoredTickets, 300000);
  })();
  

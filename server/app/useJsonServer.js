const fetch = require("node-fetch");
const headers = {
  "Content-Type": "application/json",
};

export function useJsonServer(endpoint) {
  /**
   * Read all the items from the server, update the items array when done
   * @returns the Promise from the underlying fetch call to the server
   */
  const readItems = new Promise((resolve) => {
    fetch(`http://localhost:3001/${endpoint}`).then((res) =>
      res.json().then(resolve)
    );
  });

  /**
   * Creates an item and returns a Promise containing a new list of items from the server
   * @param item {Object} an item to create
   * @returns Promise<item[]>
   */
  const createItem = (item) =>
    new Promise((resolve) => {
      fetch(`http://localhost:3001/${endpoint}`, {
        method: "POST",
        body: JSON.stringify(item),
        headers,
      }).then((resp) => {
        readItems().then(() => {
          resp.json().then(resolve);
        });
      });
    });

  /**
   * Delete an item at the given id
   * @param id {number}
   * @returns the Promise from the underlying fetch call to the server
   */
  const deleteItem = (id) =>
    fetch(`http://localhost:3001/${endpoint}/${id}`, {
      method: "DELETE",
    });

  /**
   * Deletes an item at the given id
   * @param item {Object}
   * @returns the Promise from the underlying fetch call to the server
   */
  const updateItem = (item) =>
    fetch(`http://localhost:3001/${endpoint}/${item.id}`, {
      method: "PUT",
      body: JSON.stringify(item),
      headers,
    });

  return {
    items,
    createItem,
    readItems,
    updateItem,
    deleteItem,
  };
}

import { useCallback, useEffect, useState } from "react";

const headers = {
  "Content-Type": "application/json",
};

/**
 * Generic item, your custom item types should extend this
 */
export interface Item {
  id: number;
}
export function useJsonServer(endpoint: string) {
  const [items, setItems] = useState([]);

  /**
   * Read all the items from the server, update the items array when done
   * @returns the Promise from the underlying fetch call to the server
   */
  const readItems = useCallback(
    () =>
      fetch(`http://localhost:3001/${endpoint}`)
        .then((res) => res.json())
        .then(setItems),
    [setItems, endpoint]
  );

  /**
   * Creates an item and returns a Promise containing a new list of items from the server
   * @param item {Object} an item to create
   * @returns Promise<item[]>
   */
  const createItem = useCallback(
    (item: Item) =>
      new Promise((resolve) => {
        fetch(`http://localhost:3001/${endpoint}`, {
          method: "POST",
          body: JSON.stringify(item),
          headers,
        }).then((resp) => {
          readItems().then(() => {
            resp.json().then((data) => {
              resolve(data);
            });
          });
        });
      }),
    [readItems, endpoint]
  );

  /**
   * Delete an item at the given id
   * @param id {number}
   * @returns the Promise from the underlying fetch call to the server
   */
  const deleteItem = useCallback(
    (id: number) =>
      fetch(`http://localhost:3001/${endpoint}/${id}`, {
        method: "DELETE",
      }).then(readItems),
    [readItems, endpoint]
  );

  /**
   * Deletes an item at the given id
   * @param item {Object}
   * @returns the Promise from the underlying fetch call to the server
   */
  const updateItem = (item: Item) =>
    fetch(`http://localhost:3001/${endpoint}/${item.id}`, {
      method: "PUT",
      body: JSON.stringify(item),
      headers,
    }).then(readItems);

  useEffect(() => {
    readItems();
  }, [readItems]);
  return {
    items,
    createItem,
    readItems,
    updateItem,
    deleteItem,
  };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Own External Store, this class permitting to work with useSyncExternalStore React Hook
 * @class
 * @example
 * const {useExternalStore} from 'react';
 * 
 * const store = window.store;
 * 
 * function SomeComponent() {
 *  const isOnline = useExternalStore(store.subscribe(this, 'online'), store.getSnapshot('online'));
 * 
 *  return (
 *    <>
 *      <h1>{isOnline?.value ? 'Online' : 'Offline'}</h1>
 *      <button onClick={store.set('online', { value: !isOnline.value })}
 *    </>
 *  )
 * }
 * 
 */
// class Store {
//   /**
//    * Initiate store
//    */
//   constructor(useCookie) {
//     /**
//      * @type {Map<string, [string, () => void]>}
//      */
//     this.keySubscriptions = new Map();

//     /**
//      * @type {Storage}
//      */
//     this.storage = useCookie ? window.localStorage : window.sessionStorage;

//     /**
//      * @type {Map<string, () => any}
//      */
//     this.snapshotCache = new Map();
//   }

//   /**
//    * Get data saved to localStorage or sessionStorage
//    * @param {string} key - Key used to localStorage or sessionStorage
//    * @return {{[key: string]: any}}
//    */
//   get(key) {
//     const value = this.storage.getItem(key);

//     if (!value) return null;

//     return JSON.parse(value);
//   }

//   has(key) {
//     return !!this.get(key)
//   }

//   getSnapshot(key) {
//     if (this.snapshotCache.has(key)) {
//       return this.snapshotCache.get(key);
//     }

//     const snapshot = () => this.get(key);
//     this.snapshotCache.set(key, snapshot);

//     return snapshot;
//   }

//   /**
//    * Set data to localStorage or sessionStorage
//    * Each subscribe using this key are be executed with new data
//    * @param {string} key - Key to use into localStorage or sessionStorage
//    * @param {{[key: string]: any}} value - Value to save into localStorage or sessionStorage
//    */
//   set(key, value) {
//     const oldValue = this.storage.getItem(key);
//     const sameValue = JSON.stringify(value) === oldValue;

//     this.storage.setItem(key, JSON.stringify(value));

//     console.log('dd', JSON.stringify(value), this.storage.getItem(key))

//     if (this.keySubscriptions.has(key) && !sameValue) {
//       const subscribes = this.keySubscriptions.get(key);

//       subscribes.forEach(([identifier, callback]) => {
//         callback(value);
//         console.log('[🔗] identifier: %s subscribe %s', identifier, key);
//       })
//     }

//     return this;
//   }

//   /**
//    * Subscribe key for getting value for each set
//    * @param {string} identifier - Unique identifier for each Component 
//    */
//   subscribe(identifier, ...keys) {
//     console.log(identifier);
//     if (!identifier || identifier == '') {
//       return console.error('Invalid identifier');
//     }
//     return (callback) => {
//       for (const key of keys) {
//         // If someone already track this key
//         if (this.keySubscriptions.has(key)) {
//           const subscribes = this.keySubscriptions.get(key);
//           // Push new subscribe
//           subscribes.push([identifier, callback]);
//         } else {
//           this.keySubscriptions.set(key, [
//             [identifier, callback]
//           ]);
//         }
//       };

//       return () => {
//         for (const key of keys) {
//           // If someone already track this key
//           if (this.keySubscriptions.has(key)) {
//             const subscribes = this.keySubscriptions.get(key);
//             // Left one subsription
//             if (subscribes.length == 1) {
//               this.keySubscriptions.delete(key);
//             } else {
//               const index = subscribes.findIndex((sub) => sub[0] == identifier);
//               if (index < 0) {
//                 return console.warn('Identifier not found, can not unsubscribe track');
//               }
//               subscribes.splice(index, 1)
//               this.keySubscriptions.set(key, subscribes);
//             }
//           }
//         }
//       }
//     }
//   }
// };

// window.store = new Store(true);

// if (!window.store.has('filter')) {
//   window.store.set('filter', {});
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
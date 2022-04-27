//first compile to JS with: npm run build
//then emulate with: firebase emulators:start

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
exports.init = require("./init");

const cors = require('cors')({ origin: true });

export const getContainer = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            
            //define the context            
            let objectParam = request.query.object;
            let actionRelativeLinkParam = request.query.action;
            let keyParam = request.query.key;

            if (!objectParam) {objectParam = 'people'}
            if (!actionRelativeLinkParam) {actionRelativeLinkParam = 'view'}
            
            //get the action
            const actionsSnapshot = await admin.firestore()
            .collection('actions')
            .where('object', '==', objectParam)
            .where('relativelink', '==', actionRelativeLinkParam)
            .get();
            
            const actions = actionsSnapshot.docs.map(doc => doc.data());
            
            //get the container
            const containerPromises: Promise<any>[] = []
            actions.forEach(action => {
                const p = admin.firestore()
                .collection('containers').doc(action.container).get();
                containerPromises.push(p);
            });

            const containersSnapshot = await Promise.all(containerPromises)

            let container:any = {};
            for (const snap of containersSnapshot) {
                container = snap.data()
                container.name = snap.id
                container.type = 'container'             
            }

            //get the rows
            const rowsSnapshot = await admin.firestore()
            .collection('containers').doc(container.name)
            .collection('rows').get();
            const rows = rowsSnapshot.docs.map(doc => {
                return {...doc.data(), name: doc.id, type: 'row'}
            });
            
            //get the row sections
            let returnedRows:any = [];
            for (const row of rows) {
                
                let returnedRow:any = row;
                const sectionsSnapshot = await admin.firestore()
                .collection('containers').doc(container.name)
                .collection('rows').doc(row.name)
                .collection('sections')
                .get();
                
                const sections = sectionsSnapshot.docs.map(doc => {
                    return {...doc.data(), name: doc.id}
                });

                //getting the row section items
                let returnedSections:any = [];
                for (const section of sections) {
                    
                    let returnedSection:any = section;
                    const itemsSnapshot = await admin.firestore()
                    .collection('containers').doc(container.name)
                    .collection('rows').doc(row.name)
                    .collection('sections').doc(section.name)
                    .collection('items')
                    .get();

                    const items = itemsSnapshot.docs.map(doc => {
                        return {...doc.data(), name: doc.id}
                    })

                    //getting field information
                    let returnedItems:any = [];
                    for (const item of items) {
                        let returnedItem:any = item;

                        const fieldsSnapshot = await admin.firestore()
                        .collection('fields').doc(item.name)
                        .get();

                        const field = fieldsSnapshot.data()
                        let returnedField:any = field
                        
                        
                        //getting Options if they exist
                        const optionsSnapshot = await admin.firestore()
                        .collection('fields').doc(item.name)
                        .collection('options')
                        .get();

                        const options = optionsSnapshot.docs.map(doc => {
                            return {...doc.data(), name: doc.id}
                        })

                        returnedField.options = options
                        
                        returnedField.values = []
                        if (keyParam) {
                            //getting Values if they exist
                            const valuesSnapshot = await admin.firestore()
                            .collection('data').doc(keyParam.toString())
                            .collection('fields').doc(item.name)
                            .get();

                            const values = valuesSnapshot.data()
                            if (values)
                            {
                                values.values.forEach((value: any) => returnedField.values.push(value));
                            }
                        }
                        
                        returnedItem.field = returnedField;
                        returnedItems.push(returnedItem);
                    }
                    returnedSection.section_fields = returnedItems;
                    returnedSections.push(returnedSection);
                }
                    

                returnedRow.sections = returnedSections;
                returnedRows.push(returnedRow);
            }
            
            

            container.sections = returnedRows;

            console.log("Container ===> ", container);

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(container);
        }

        catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    });
});

export const getObjects = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {

            //get objects
            let objectParam = request.query.object;
            if(!objectParam) {
                objectParam = 'objects'
            }

            let results = await admin.firestore()
            .collection(`${objectParam}`)
            .get()
            .then(async (querySnapshot) => {
                let allObjects:Promise<any>[] = [];
                const item = await querySnapshot.docs.map(async (doc) => {
                    const p = await admin.firestore()
                    .collection(`${objectParam}`)
                    .doc(doc.id)
                    .get();
                    const objectInfo = {...p.data(), name: doc.id};
                    return objectInfo;
                });
                allObjects = item;
                const objectPromiseSnapshot = await Promise.all(allObjects);
                return objectPromiseSnapshot;          
            });
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }

        catch (error) {
            console.log(error);
            response.status(500).send(error)
        }
    })
});


export const getMenu = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            const results: String[] = []
            const menuSnapshot = await admin.firestore().collection('menu').get();
            const menus = menuSnapshot.docs.map(doc => doc.data());
            const menuPromises: Promise<any>[] = []
            menus.forEach(menu => {
                const p = admin.firestore().collection('actions').doc(menu.action).get();
                menuPromises.push(p);
            })
            
            const actionsSnapshots = await Promise.all(menuPromises);

            actionsSnapshots.forEach(snap => {
                const action = snap.data()
                
               action.name = snap.id
                menus.forEach(menu => {
                    if (menu.action == action.name) {action.order = menu.order}
                })
                results.push(action)
            })

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }
        catch (error) {
            console.log(error)
            response.status(500).send(error)
        }

    });
});

export const updateObject = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.document)
            .delete();

            await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.data.uniqueName)
            .set({
                label: request.body.data.label,
                key: request.body.data.key
            });         

            // await admin.firestore()
            // .collection("actions")
            // .where("object", "==", request.body.document)
            // .get()
            // .then((querySnapshot) => {
            //     querySnapshot.forEach(async (doc) => {
            //         await admin.firestore().collection("actions").doc(doc.id).update({object: request.body.data.uniqueName});
            //     });
            // });

            const updatedObjectInfo = await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.data.uniqueName)
            .get();

            const object = updatedObjectInfo.data();
            let returnObject = object

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({...returnObject, name: request.body.data.uniqueName});
        }

        catch(error) {
            console.log(error);
            response.status(500).send(error);
        }
    });
});


export const createObject = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.data.uniqueName)
            .set({
                label: request.body.data.label,
                key: request.body.data.key
            });

            const addedObjectInfo = await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.data.uniqueName)
            .get();

            const object = addedObjectInfo.data();
            let returnObject = object;

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({...returnObject, name: request.body.data.uniqueName});
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const getFields = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            
            //get Fields
            let fieldParam = request.query.field;
            if(!fieldParam) {
                fieldParam = 'fields'
            }

            let results = await admin.firestore()
            .collection(`${fieldParam}`)
            .get()
            .then(async (querySnapshot) => {
                let allFields:Promise<any>[] = [];
                const item = await querySnapshot.docs.map(async (doc) => {
                    const p = await admin.firestore()
                    .collection(`${fieldParam}`)
                    .doc(doc.id)
                    .get();
                    const optionsOfField = await admin.firestore()
                    .collection(`${fieldParam}`)
                    .doc(doc.id)
                    .collection('options')
                    .get()
                    .then(async (querySnapshot) => {
                        let allOptions:Promise<any>[] = [];
                        const options = await querySnapshot.docs.map(async (doc2) => {
                            const l = await admin.firestore()
                            .collection('fields')
                            .doc(doc.id)
                            .collection('options')
                            .doc(doc2.id)
                            .get();
                            const fieldOptionInfo = {...l.data(), name: doc2.id}
                            return fieldOptionInfo;
                        });
                        allOptions = options;
                        const allFieldOptionSnapshot = await Promise.all(allOptions);
                        return allFieldOptionSnapshot;
                    });
                    const fieldInfo = {...p.data(), name: doc.id, options: optionsOfField};
                    console.log("Field Info => ",  fieldInfo);
                    return fieldInfo;
                });
                allFields = item;
                const fieldPromiseSnapshot = await Promise.all(allFields);
                return fieldPromiseSnapshot;
            });

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }

        catch(err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const createField = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.data.uniqueName)
            .set({
                label: request.body.data.label,
                type: request.body.data.type
            });

            const addedFieldInfo = await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.data.uniqueName)
            .get();

            const field = addedFieldInfo.data();
            let returnField = field;

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({...returnField, name: request.body.data.uniqueName});
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const updateField = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.document)
            .delete();

            await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.data.uniqueName)
            .set({
                label: request.body.data.label,
                type: request.body.data.type
            });

            // request.body.data.options.forEach(async (opt:any) => {
            //     await admin.firestore()
            //     .collection(request.body.collection)
            //     .doc(request.body.data.uniqueName)
            //     .collection("options")
            //     .doc(opt.name)
            //     .set({
            //         label: opt.label
            //     });
            // })
            const updatedFieldInfo = await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.data.uniqueName)
            .get();

            // let updatedOptionsofField = await admin.firestore()
            // .collection(request.body.collection)
            // .doc(request.body.data.uniqueName)
            // .collection('options')
            // .get()
            // .then(async (querySnapshot) => {
            //     let allFields:Promise<any>[] = [];
            //     const item = await querySnapshot.docs.map(async (doc) => {
            //         const p = await admin.firestore()
            //         .collection(request.body.collection)
            //         .doc(request.body.data.uniqueName)
            //         .collection('options')
            //         .doc(doc.id)
            //         .get();
            //         const fieldInfo = {...p.data(), name: doc.id};
            //         return fieldInfo;
            //     });
            //     allFields = item;
            //     const fieldPromiseSnapshot = await Promise.all(allFields);
            //     return fieldPromiseSnapshot;
            // });

            const field = updatedFieldInfo.data();
            let returnField = field;

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            // response.send({...returnField, name: request.body.data.uniqueName, options: updatedOptionsofField });
            response.send({...returnField, name: request.body.data.uniqueName });
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const createOptionField = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            await admin.firestore()
            .collection('fields')
            .doc(request.body.document)
            .collection("options")
            .doc(request.body.data.name)
            .set({
                label: request.body.data.label
            });

            const addedOptionOfField = await admin.firestore()
            .collection("fields")
            .doc(request.body.document)
            .collection("options")
            .doc(request.body.data.name)
            .get();

            const option = addedOptionOfField.data();
            let returnOption = option;

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({...returnOption, name: request.body.data.name});
        }

        catch(err) {
            console.log(err);
            response.status(500).send(err);
        }
    })
});

export const getOptionField = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try  {
            const fieldName = request.query.document;

            let results = await admin.firestore()
            .collection('fields')
            .doc(`${fieldName}`)
            .collection('options')
            .get()
            .then(async (querySnapshot) => {
                let allOptions:Promise<any>[] = [];
                const options = await querySnapshot.docs.map(async (doc) => {
                    const p = await admin.firestore()
                    .collection('fields')
                    .doc(`${fieldName}`)
                    .collection('options')
                    .doc(doc.id)
                    .get();
                    const optionInfo = {...p.data(), name: doc.id}
                    return optionInfo;
                });
                allOptions = options;
                const allOptionsofField = await Promise.all(allOptions);
                return allOptionsofField;
            });
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    })
})

export const getContainers = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            //get Containers
            let containerParam = request.query.containers
            if(!containerParam) containerParam = "containers";

            let results = await admin.firestore()
            .collection(`${containerParam}`)
            .get()
            .then(async (querySnapshot) => {
                let allContainers:Promise<any>[] = [];
                const item = await querySnapshot.docs.map(async (doc) => {
                    const p = await admin.firestore()
                    .collection(`${containerParam}`)
                    .doc(doc.id)
                    .get();
                    const rowsOfField = await admin.firestore()
                    .collection(`${containerParam}`)
                    .doc(doc.id)
                    .collection("rows")
                    .get()
                    .then(async (querySnapshot) => {
                        let allRows:Promise<any>[] = [];
                        const rows = await querySnapshot.docs.map(async (doc2) => {
                            const l = await admin.firestore()
                            .collection(`${containerParam}`)
                            .doc(doc.id)
                            .collection('rows')
                            .doc(doc2.id)
                            .get();
                            const sectionsOfRow = await admin.firestore()
                            .collection(`${containerParam}`)
                            .doc(doc.id)
                            .collection('rows')
                            .doc(doc2.id)
                            .collection('sections')
                            .get()
                            .then(async (querySnapshot) => {
                                let allSections:Promise<any>[] = [];
                                const sections = await querySnapshot.docs.map(async (doc3) => {
                                    const k = await admin.firestore()
                                    .collection(`${containerParam}`)
                                    .doc(doc.id)
                                    .collection('rows')
                                    .doc(doc2.id)
                                    .collection('sections')
                                    .doc(doc3.id)
                                    .get();
                                    const itemsOfSections = await admin.firestore()
                                    .collection(`${containerParam}`)
                                    .doc(doc.id)
                                    .collection('rows')
                                    .doc(doc2.id)
                                    .collection('sections')
                                    .doc(doc3.id)
                                    .collection('items')
                                    .get()
                                    .then(async (querySnapshot) => {
                                        let allRows:Promise<any>[] = [];
                                        const rows = await querySnapshot.docs.map(async (doc4) => {
                                            const m = await admin.firestore()
                                            .collection(`${containerParam}`)
                                            .doc(doc.id)
                                            .collection('rows')
                                            .doc(doc2.id)
                                            .collection('sections')
                                            .doc(doc3.id)
                                            .collection('items')
                                            .doc(doc4.id)
                                            .get();
                                            const ItemRowInfo = {...m.data(), name:doc4.id}
                                            return ItemRowInfo;
                                        });
                                        allRows = rows;
                                        const allItemRowsSnapshot = await Promise.all(allRows);
                                        return allItemRowsSnapshot;
                                    });
                                    const RowSectionInfo = {...k.data(), name:doc3.id, items: itemsOfSections}
                                    return RowSectionInfo;
                                });
                                allSections = sections;
                                const allRowSectionsSnapshot = await Promise.all(allSections);
                                return allRowSectionsSnapshot;
                            });
                            const FieldRowInfo = {...l.data(), name: doc2.id, sections: sectionsOfRow}
                            return FieldRowInfo;
                        });
                        allRows = rows;
                        const allRowSnapshot = await Promise.all(allRows);
                        return allRowSnapshot;
                    });
                    const containerInfo = {...p.data(), name: doc.id, rows: rowsOfField}
                    return containerInfo;
                });
                allContainers = item;
                const allContainerSnapshot = await Promise.all(allContainers);
                return allContainerSnapshot;
            });
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }   

        catch(err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const updateContainer = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            // Remove old document
            await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.document)
            .delete();

            //Set Container Document with updated info
            await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.data.name)
            .set({
                label: request.body.data.label,
                width: request.body.data.width,
                align: request.body.data.align,
            });

            //Get the updated info
            const updatedContainerInfo = await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.data.name)
            .get();

            //Copy rows collection from old document to new document(request.body.document -> request.body.data.name)
            await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.document)
            .collection('rows')
            .get()
            .then(async (querySnapshot) => {
                await querySnapshot.docs.map(async (doc) => {
                    const l = await admin.firestore()
                    .collection(request.body.collection)
                    .doc(request.body.document)
                    .collection('rows')
                    .doc(doc.id)
                    .get();
                    await admin.firestore()
                    .collection(request.body.collection)
                    .doc(request.body.document)
                    .collection('rows')
                    .doc(doc.id)
                    .collection('sections')
                    .get()
                    .then(async (querySnapshot) => {
                        await querySnapshot.docs.map(async (doc2) => {
                            const k = await admin.firestore()
                            .collection(request.body.collection)
                            .doc(request.body.document)
                            .collection('rows')
                            .doc(doc.id)
                            .collection('sections')
                            .doc(doc2.id)
                            .get();
                            await admin.firestore()
                            .collection(request.body.collection)
                            .doc(request.body.document)
                            .collection('rows')
                            .doc(doc.id)
                            .collection('sections')
                            .doc(doc2.id)
                            .collection('items')
                            .get()
                            .then(async (querySnapshot) => {
                                await querySnapshot.docs.map(async (doc3) => {
                                    const m = await admin.firestore()
                                    .collection(request.body.collection)
                                    .doc(request.body.document)
                                    .collection('rows')
                                    .doc(doc.id)
                                    .collection('sections')
                                    .doc(doc2.id)
                                    .collection('items')
                                    .doc(doc3.id)
                                    .get();
                                    await admin.firestore()
                                    .collection(request.body.collection)
                                    .doc(request.body.data.name)
                                    .collection('rows')
                                    .doc(doc.id)
                                    .collection('sections')
                                    .doc(doc2.id)
                                    .collection('items')
                                    .doc(doc3.id)
                                    .set({...m.data()});
                                });
                            });
                            const RowSectionInfo = k.data();
                            await admin.firestore()
                            .collection(request.body.collection)
                            .doc(request.body.data.name)
                            .collection('rows')
                            .doc(doc.id)
                            .collection('sections')
                            .doc(doc2.id)
                            .set({...RowSectionInfo});
                        });
                    });
                    const FieldRowInfo = l.data();
                    await admin.firestore()
                    .collection(request.body.collection)
                    .doc(request.body.data.name)
                    .collection('rows')
                    .doc(doc.id)
                    .set({...FieldRowInfo});
                });
            });

            //Get the newly added rows collection data from request.body.data.name
            const rowsOfField = await admin.firestore()
            .collection(request.body.collection)
            .doc(request.body.document)
            .collection('rows')
            .get()
            .then(async (querySnapshot) => {
                let allRows:Promise<any>[] = [];
                let rows = await querySnapshot.docs.map(async (doc) => {
                    const l = await admin.firestore()
                    .collection(request.body.collection)
                    .doc(request.body.document)
                    .collection('rows')
                    .doc(doc.id)
                    .get();
                    const sectionsOfRow = await admin.firestore()
                    .collection(request.body.collection)
                    .doc(request.body.document)
                    .collection('rows')
                    .doc(doc.id)
                    .collection('sections')
                    .get()
                    .then(async (querySnapshot) => {
                        let allSections:Promise<any>[] = [];
                        const sections = await querySnapshot.docs.map(async (doc2) => {
                            const k = await admin.firestore()
                            .collection(request.body.collection)
                            .doc(request.body.document)
                            .collection('rows')
                            .doc(doc.id)
                            .collection('sections')
                            .doc(doc2.id)
                            .get();
                            const itemsOfSections = await admin.firestore()
                            .collection(request.body.collection)
                            .doc(request.body.document)
                            .collection('rows')
                            .doc(doc.id)
                            .collection('sections')
                            .doc(doc2.id)
                            .collection('items')
                            .get()
                            .then(async (querySnapshot) => {
                                let allRows:Promise<any>[] = [];
                                const rows = await querySnapshot.docs.map(async (doc3) => {
                                    const m = await admin.firestore()
                                    .collection(request.body.collection)
                                    .doc(request.body.document)
                                    .collection('rows')
                                    .doc(doc.id)
                                    .collection('sections')
                                    .doc(doc2.id)
                                    .collection('items')
                                    .doc(doc3.id)
                                    .get();
                                    const ItemRowInfo = {...m.data(), name:doc3.id}
                                    return ItemRowInfo;
                                });
                                allRows = rows;
                                const allItemRowsSnapshot = await Promise.all(allRows);
                                return allItemRowsSnapshot;
                            });
                            const RowSectionInfo = {...k.data(), name:doc2.id, items: itemsOfSections}
                            return RowSectionInfo;
                        });
                        allSections = sections;
                        const allRowSectionsSnapshot = await Promise.all(allSections);
                        return allRowSectionsSnapshot;
                    });
                    const FieldRowInfo = {...l.data(), name: doc.id, sections: sectionsOfRow}
                    return FieldRowInfo;
                });
                allRows = rows;
                const allRowSnapshot = await Promise.all(allRows);
                return allRowSnapshot;
            });

            if(request.body.data.name != request.body.document)
            {
                //Remove old rows collecion in old document
                await admin.firestore()
                .collection(request.body.collection)
                .doc(request.body.document)
                .collection('rows')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.docs.map(async (doc) => {
                        await admin.firestore()
                        .collection(request.body.collection)
                        .doc(request.body.document)
                        .collection('rows')
                        .doc(doc.id)
                        .collection('sections')
                        .get()
                        .then(async (querySnapshot) => {
                            await querySnapshot.docs.map(async (doc2) => {
                                await admin.firestore()
                                .collection(request.body.collection)
                                .doc(request.body.document)
                                .collection('rows')
                                .doc(doc.id)
                                .collection('sections')
                                .doc(doc2.id)
                                .collection('items')
                                .get()
                                .then(async (querySnapshot) => {
                                    await querySnapshot.docs.map(async (doc3) => {
                                        await admin.firestore()
                                        .collection(request.body.collection)
                                        .doc(request.body.document)
                                        .collection('rows')
                                        .doc(doc.id)
                                        .collection('sections')
                                        .doc(doc2.id)
                                        .collection('items')
                                        .doc(doc3.id)
                                        .delete();
                                    });
                                });
                                await admin.firestore()
                                .collection(request.body.collection)
                                .doc(request.body.document)
                                .collection('rows')
                                .doc(doc.id)
                                .collection('sections')
                                .doc(doc2.id)
                                .delete();
                            });
                        });
                        await admin.firestore()
                        .collection(request.body.collection)
                        .doc(request.body.document)
                        .collection('rows')
                        .doc(doc.id)
                        .delete();
                    });        
                });
            }       
            const container = updatedContainerInfo.data();
            let returnContainer = container;

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({...returnContainer, name: request.body.data.name, rows: rowsOfField});
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const deleteContainerItem = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            let documentName = request.query.document;
            
            //Remove old document in containers collection
            await admin.firestore()
            .collection("containers")
            .doc(`${documentName}`)
            .delete();

            //Remove old rows collecion in old document
            await admin.firestore()
            .collection('containers')
            .doc(`${documentName}`)
            .collection('rows')
            .get()
            .then((querySnapshot) => {
                querySnapshot.docs.map(async (doc) => {
                    await admin.firestore()
                    .collection('containers')
                    .doc(`${documentName}`)
                    .collection('rows')
                    .doc(doc.id)
                    .collection('sections')
                    .get()
                    .then(async (querySnapshot) => {
                        await querySnapshot.docs.map(async (doc2) => {
                            await admin.firestore()
                            .collection('containers')
                            .doc(`${documentName}`)
                            .collection('rows')
                            .doc(doc.id)
                            .collection('sections')
                            .doc(doc2.id)
                            .collection('items')
                            .get()
                            .then(async (querySnapshot) => {
                                await querySnapshot.docs.map(async (doc3) => {
                                    await admin.firestore()
                                    .collection('containers')
                                    .doc(`${documentName}`)
                                    .collection('rows')
                                    .doc(doc.id)
                                    .collection('sections')
                                    .doc(doc2.id)
                                    .collection('items')
                                    .doc(doc3.id)
                                    .delete();
                                });
                            });
                            await admin.firestore()
                            .collection('containers')
                            .doc(`${documentName}`)
                            .collection('rows')
                            .doc(doc.id)
                            .collection('sections')
                            .doc(doc2.id)
                            .delete();
                        });
                    });
                    await admin.firestore()
                    .collection('containers')
                    .doc(`${documentName}`)
                    .collection('rows')
                    .doc(doc.id)
                    .delete();
                });        
            });

            let results = await admin.firestore()
            .collection("containers")
            .get()
            .then(async (querySnapshot) => {
                let allContainers:Promise<any>[] = [];
                const item = await querySnapshot.docs.map(async (doc) => {
                    const p = await admin.firestore()
                    .collection("containers")
                    .doc(doc.id)
                    .get();
                    const rowsOfField = await admin.firestore()
                    .collection("containers")
                    .doc(doc.id)
                    .collection("rows")
                    .get()
                    .then(async (querySnapshot) => {
                        let allRows:Promise<any>[] = [];
                        const rows = await querySnapshot.docs.map(async (doc2) => {
                            const l = await admin.firestore()
                            .collection("containers")
                            .doc(doc.id)
                            .collection('rows')
                            .doc(doc2.id)
                            .get();
                            const sectionsOfRow = await admin.firestore()
                            .collection('containers')
                            .doc(doc.id)
                            .collection('rows')
                            .doc(doc2.id)
                            .collection('sections')
                            .get()
                            .then(async (querySnapshot) => {
                                let allSections:Promise<any>[] = [];
                                const sections = await querySnapshot.docs.map(async (doc3) => {
                                    const k = await admin.firestore()
                                    .collection('containers')
                                    .doc(doc.id)
                                    .collection('rows')
                                    .doc(doc2.id)
                                    .collection('sections')
                                    .doc(doc3.id)
                                    .get();
                                    const itemsOfSections = await admin.firestore()
                                    .collection('containers')
                                    .doc(doc.id)
                                    .collection('rows')
                                    .doc(doc2.id)
                                    .collection('sections')
                                    .doc(doc3.id)
                                    .collection('items')
                                    .get()
                                    .then(async (querySnapshot) => {
                                        let allRows:Promise<any>[] = [];
                                        const rows = await querySnapshot.docs.map(async (doc4) => {
                                            const m = await admin.firestore()
                                            .collection('containers')
                                            .doc(doc.id)
                                            .collection('rows')
                                            .doc(doc2.id)
                                            .collection('sections')
                                            .doc(doc3.id)
                                            .collection('items')
                                            .doc(doc4.id)
                                            .get();
                                            const ItemRowInfo = {...m.data(), name:doc4.id}
                                            return ItemRowInfo;
                                        });
                                        allRows = rows;
                                        const allItemRowsSnapshot = await Promise.all(allRows);
                                        return allItemRowsSnapshot;
                                    });
                                    const RowSectionInfo = {...k.data(), name:doc3.id, items: itemsOfSections}
                                    return RowSectionInfo;
                                });
                                allSections = sections;
                                const allRowSectionsSnapshot = await Promise.all(allSections);
                                return allRowSectionsSnapshot;
                            });
                            const FieldRowInfo = {...l.data(), name: doc2.id, sections: sectionsOfRow}
                            return FieldRowInfo;
                        });
                        allRows = rows;
                        const allRowSnapshot = await Promise.all(allRows);
                        return allRowSnapshot;
                    });
                    const containerInfo = {...p.data(), name: doc.id, rows: rowsOfField}
                    return containerInfo;
                });
                allContainers = item;
                const allContainerSnapshot = await Promise.all(allContainers);
                return allContainerSnapshot;
            });
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const updateContainerRow = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {

            //Remove old document
            await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .delete();

            //Set Container Row Document with updated info
            await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.data.name)
            .set({
                label: request.body.data.label,
                align: request.body.data.align,
                order: request.body.data.order,
                width: request.body.data.width
            });

            //Get the updated info
            const updatedContainerRowInfo = await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.data.name)
            .get();

            //Copy sections collection from old document to new document(request.body.rowDocument -> request.body.data.name)
            await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .get()
            .then(async (querySnapshot) => {
                await querySnapshot.docs.map(async (doc) => {
                    const k = await admin.firestore()
                    .collection('containers')
                    .doc(request.body.containerDocument)
                    .collection('rows')
                    .doc(request.body.rowDocument)
                    .collection('sections')
                    .doc(doc.id)
                    .get();
                    await admin.firestore()
                    .collection('containers')
                    .doc(request.body.containerDocument)
                    .collection('rows')
                    .doc(request.body.rowDocument)
                    .collection('sections')
                    .doc(doc.id)
                    .collection('items')
                    .get()
                    .then(async (querySnapshot) => {
                        await querySnapshot.docs.map(async (doc2) => {
                            const m = await admin.firestore()
                            .collection('containers')
                            .doc(request.body.containerDocument)
                            .collection('rows')
                            .doc(request.body.rowDocument)
                            .collection('sections')
                            .doc(doc.id)
                            .collection('items')
                            .doc(doc2.id)
                            .get();
                            await admin.firestore()
                            .collection('containers')
                            .doc(request.body.containerDocument)
                            .collection('rows')
                            .doc(request.body.data.name)
                            .collection('sections')
                            .doc(doc.id)
                            .collection('items')
                            .doc(doc2.id)
                            .set({...m.data()});
                        });
                    });
                    const RowSectionInfo = k.data();
                    await admin.firestore()
                    .collection('containers')
                    .doc(request.body.containerDocument)
                    .collection('rows')
                    .doc(request.body.data.name)
                    .collection('sections')
                    .doc(doc.id)
                    .set({...RowSectionInfo});
                });
            });

            //Get the newly added sections collection data from request.body.data.name
            const sectionsOfRow = await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .get()
            .then(async (querySnapshot) => {
                let allSections:Promise<any>[] = [];
                const sections = await querySnapshot.docs.map(async (doc) => {
                    const k = await admin.firestore()
                    .collection('containers')
                    .doc(request.body.containerDocument)
                    .collection('rows')
                    .doc(request.body.rowDocument)
                    .collection('sections')
                    .doc(doc.id)
                    .get();
                    const itemsOfSections = await admin.firestore()
                    .collection('containers')
                    .doc(request.body.containerDocument)
                    .collection('rows')
                    .doc(request.body.rowDocument)
                    .collection('sections')
                    .doc(doc.id)
                    .collection('items')
                    .get()
                    .then(async (querySnapshot) => {
                        let allRows:Promise<any>[] = [];
                        const rows = await querySnapshot.docs.map(async (doc2) => {
                            const m = await admin.firestore()
                            .collection('containers')
                            .doc(request.body.containerDocument)
                            .collection('rows')
                            .doc(request.body.rowDocument)
                            .collection('sections')
                            .doc(doc.id)
                            .collection('items')
                            .doc(doc2.id)
                            .get();
                            const ItemRowInfo = {...m.data(), name:doc2.id}
                            return ItemRowInfo;
                        });
                        allRows = rows;
                        const allItemRowsSnapshot = await Promise.all(allRows);
                        return allItemRowsSnapshot;
                    });
                    const RowSectionInfo = {...k.data(), name:doc.id, items: itemsOfSections}
                    return RowSectionInfo;
                });
                allSections = sections;
                const allRowSectionsSnapshot = await Promise.all(allSections);
                return allRowSectionsSnapshot;
            });

            if(request.body.data.name != request.body.rowDocument)
            {
                //Remove old collection in old document
                await admin.firestore()
                .collection('containers')
                .doc(request.body.containerDocument)
                .collection('rows')
                .doc(request.body.rowDocument)
                .collection('sections')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.docs.map(async (doc) => {
                        await admin.firestore()
                        .collection('containers')
                        .doc(request.body.containerDocument)
                        .collection('rows')
                        .doc(request.body.rowDocument)
                        .collection('sections')
                        .doc(doc.id)
                        .collection('items')
                        .get()
                        .then(async (querySnapshot) => {
                            await querySnapshot.docs.map(async (doc2) => {
                                await admin.firestore()
                                .collection('containers')
                                .doc(request.body.containerDocument)
                                .collection('rows')
                                .doc(request.body.rowDocument)
                                .collection('sections')
                                .doc(doc.id)
                                .collection('items')
                                .doc(doc2.id)
                                .delete();
                            });
                        });
                        await admin.firestore()
                        .collection('containers')
                        .doc(request.body.containerDocument)
                        .collection('rows')
                        .doc(request.body.rowDocument)
                        .collection('sections')
                        .doc(doc.id)
                        .delete();
                    });
                });   
            }            

            const row = updatedContainerRowInfo.data();
            let returnRow = row;

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({...returnRow, name: request.body.data.name, sections: sectionsOfRow});
        }

        catch(err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const deleteContainerRowItem = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            let containerDocumentName = request.query.container_document;
            let rowDocumentName = request.query.row_document;
            
            //Remove old document in container rows collection
            await admin.firestore()
            .collection('containers')
            .doc(`${containerDocumentName}`)
            .collection('rows')
            .doc(`${rowDocumentName}`)
            .delete();

            //Remove old sections collection in old document
            await admin.firestore()
            .collection('containers')
            .doc(`${containerDocumentName}`)
            .collection('rows')
            .doc(`${rowDocumentName}`)
            .collection('sections')
            .get()
            .then(async (querySnapshot) => {
                await querySnapshot.docs.map(async (doc) => {
                    await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocumentName}`)
                    .collection('rows')
                    .doc(`${rowDocumentName}`)
                    .collection('sections')
                    .doc(doc.id)
                    .collection('items')
                    .get()
                    .then(async (querySnapshot) => {
                        await querySnapshot.docs.map(async (doc2) => {
                            await admin.firestore()
                            .collection('containers')
                            .doc(`${containerDocumentName}`)
                            .collection('rows')
                            .doc(`${rowDocumentName}`)
                            .collection('sections')
                            .doc(doc.id)
                            .collection('items')
                            .doc(doc2.id)
                            .delete();
                        });
                    });
                    await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocumentName}`)
                    .collection('rows')
                    .doc(`${rowDocumentName}`)
                    .collection('sections')
                    .doc(doc.id)
                    .delete();
                });
            });

            const results = await admin.firestore()
            .collection("containers")
            .doc(`${containerDocumentName}`)
            .collection("rows")
            .get()
            .then(async (querySnapshot) => {
                let allRows:Promise<any>[] = [];
                const rows = await querySnapshot.docs.map(async (doc2) => {
                    const l = await admin.firestore()
                    .collection("containers")
                    .doc(`${containerDocumentName}`)
                    .collection('rows')
                    .doc(doc2.id)
                    .get();
                    const sectionsOfRow = await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocumentName}`)
                    .collection('rows')
                    .doc(doc2.id)
                    .collection('sections')
                    .get()
                    .then(async (querySnapshot) => {
                        let allSections:Promise<any>[] = [];
                        const sections = await querySnapshot.docs.map(async (doc3) => {
                            const k = await admin.firestore()
                            .collection('containers')
                            .doc(`${containerDocumentName}`)
                            .collection('rows')
                            .doc(doc2.id)
                            .collection('sections')
                            .doc(doc3.id)
                            .get();
                            const itemsOfSections = await admin.firestore()
                            .collection('containers')
                            .doc(`${containerDocumentName}`)
                            .collection('rows')
                            .doc(doc2.id)
                            .collection('sections')
                            .doc(doc3.id)
                            .collection('items')
                            .get()
                            .then(async (querySnapshot) => {
                                let allRows:Promise<any>[] = [];
                                const rows = await querySnapshot.docs.map(async (doc4) => {
                                    const m = await admin.firestore()
                                    .collection('containers')
                                    .doc(`${containerDocumentName}`)
                                    .collection('rows')
                                    .doc(doc2.id)
                                    .collection('sections')
                                    .doc(doc3.id)
                                    .collection('items')
                                    .doc(doc4.id)
                                    .get();
                                    const ItemRowInfo = {...m.data(), name:doc4.id}
                                    return ItemRowInfo;
                                });
                                allRows = rows;
                                const allItemRowsSnapshot = await Promise.all(allRows);
                                return allItemRowsSnapshot;
                            });
                            const RowSectionInfo = {...k.data(), name:doc3.id, items: itemsOfSections}
                            return RowSectionInfo;
                        });
                        allSections = sections;
                        const allRowSectionsSnapshot = await Promise.all(allSections);
                        return allRowSectionsSnapshot;
                    });
                    const FieldRowInfo = {...l.data(), name: doc2.id, sections: sectionsOfRow}
                    return FieldRowInfo;
                });
                allRows = rows;
                const allRowSnapshot = await Promise.all(allRows);
                return allRowSnapshot;
            });
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const deleteContainerRowSection = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {

            let containerDocumentName = request.query.container_document;
            let rowDocumentName = request.query.row_document;
            let sectionDocumentName = request.query.section_document;

            //Remove old documet in container row section collection
            await admin.firestore()
            .collection('containers')
            .doc(`${containerDocumentName}`)
            .collection('rows')
            .doc(`${rowDocumentName}`)
            .collection('sections')
            .doc(`${sectionDocumentName}`)
            .delete();

            //Remove old items collection in old document
            await admin.firestore()
            .collection('containers')
            .doc(`${containerDocumentName}`)
            .collection('rows')
            .doc(`${rowDocumentName}`)
            .collection('sections')
            .doc(`${sectionDocumentName}`)
            .collection('items')
            .get()
            .then(async (querySnapshot) => {
                await querySnapshot.docs.map(async (doc) => {
                    await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocumentName}`)
                    .collection('rows')
                    .doc(`${rowDocumentName}`)
                    .collection('sections')
                    .doc(`${sectionDocumentName}`)
                    .collection('items')
                    .doc(doc.id)
                    .delete();
                });
            });

            const results = await admin.firestore()
            .collection('containers')
            .doc(`${containerDocumentName}`)
            .collection('rows')
            .doc(`${rowDocumentName}`)
            .collection('sections')
            .get()
            .then(async (querySnapshot) => {
                let allSections:Promise<any>[] = [];
                const sections = await querySnapshot.docs.map(async (doc) => {
                    const k = await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocumentName}`)
                    .collection('rows')
                    .doc(`${rowDocumentName}`)
                    .collection('sections')
                    .doc(doc.id)
                    .get();
                    const itemsOfSections = await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocumentName}`)
                    .collection('rows')
                    .doc(`${rowDocumentName}`)
                    .collection('sections')
                    .doc(doc.id)
                    .collection('items')
                    .get()
                    .then(async (querySnapshot) => {
                        let allRows:Promise<any>[] = [];
                        const rows = await querySnapshot.docs.map(async (doc2) => {
                            const m = await admin.firestore()
                            .collection('containers')
                            .doc(`${containerDocumentName}`)
                            .collection('rows')
                            .doc(`${rowDocumentName}`)
                            .collection('sections')
                            .doc(doc.id)
                            .collection('items')
                            .doc(doc2.id)
                            .get();
                            const ItemRowInfo = {...m.data(), name:doc2.id}
                            return ItemRowInfo;
                        });
                        allRows = rows;
                        const allItemRowsSnapshot = await Promise.all(allRows);
                        return allItemRowsSnapshot;
                    });
                    const RowSectionInfo = {...k.data(), name:doc.id, items: itemsOfSections}
                    return RowSectionInfo;
                });
                allSections = sections;
                const allRowSectionsSnapshot = await Promise.all(allSections);
                return allRowSectionsSnapshot;
            });
            
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    })
});

export const updateContainerRowSection = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {

            //Remove old document
            await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .doc(request.body.sectionDocument)
            .delete();

            //Set Container Row Section Document with updated info
            await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .doc(request.body.data.name)
            .set({
                label: request.body.data.label,
                order: request.body.data.order,
                width: request.body.data.width
            });

            //Get the updated info
            const updatedSectionInfo = await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .doc(request.body.data.name)
            .get();

            //Copy items collection from old document to new document(request.body.sectionDocument -> request.body.data.name)
            await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .doc(request.body.sectionDocument)
            .collection('items')
            .get()
            .then(async (querySnapshot) => {
                await querySnapshot.docs.map(async (doc) => {
                    const k = await admin.firestore()
                    .collection('containers')
                    .doc(request.body.containerDocument)
                    .collection('rows')
                    .doc(request.body.rowDocument)
                    .collection('sections')
                    .doc(request.body.sectionDocument)
                    .collection('items')
                    .doc(doc.id)
                    .get();
                    await admin.firestore()
                    .collection('containers')
                    .doc(request.body.containerDocument)
                    .collection('rows')
                    .doc(request.body.rowDocument)
                    .collection('sections')
                    .doc(request.body.data.name)
                    .collection('items')
                    .doc(doc.id)
                    .set({...k.data()});
                });
            });

            //Get the newly added items collection data from request.body.data.name
            const items = await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .doc(request.body.data.name)
            .collection('items')
            .get()
            .then(async (querySnapshot) => {
                let allItems:Promise<any>[] = [];
                const allItemsInfo = await querySnapshot.docs.map(async (doc) => {
                    const m = await admin.firestore()
                    .collection('containers')
                    .doc(request.body.containerDocument)
                    .collection('rows')
                    .doc(request.body.rowDocument)
                    .collection('sections')
                    .doc(request.body.data.name)
                    .collection('items')
                    .doc(doc.id)
                    .get();
                    const itemInfo = {...m.data(), name:doc.id}
                    return itemInfo;
                });
                allItems = allItemsInfo;
                const allItemSnapshot = await Promise.all(allItems);
                return allItemSnapshot;
            });

            console.log("New Items => ", items);

            if(request.body.data.name != request.body.sectionDocument)
            {
                //Remove old collection in old document
                await admin.firestore()
                .collection('containers')
                .doc(request.body.containerDocument)
                .collection('rows')
                .doc(request.body.rowDocument)
                .collection('sections')
                .doc(request.body.sectionDocument)
                .collection('items')
                .get()
                .then(async (querySnapshot) => {
                    await querySnapshot.docs.map(async (doc) => {
                        await admin.firestore()
                        .collection('containers')
                        .doc(request.body.containerDocument)
                        .collection('rows')
                        .doc(request.body.rowDocument)
                        .collection('sections')
                        .doc(request.body.sectionDocument)
                        .collection('items')
                        .doc(doc.id)
                        .delete();
                    });
                });
            }            

            const section = updatedSectionInfo.data();
            let returnSection = section;

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({...returnSection, name: request.body.data.name, items: items});
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
})

export const updateContainerRowSectionItem = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            //Set Container Row Section Item Document with updated Info
            await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .doc(request.body.sectionDocument)
            .collection('items')
            .doc(request.body.data.name)
            .set({
                order:request.body.data.order
            });

            //Get updated Row Section Item Document
            const updatedItem = await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .doc(request.body.sectionDocument)
            .collection('items')
            .doc(request.body.data.name)
            .get();

            //Remove old Container Row Section Item Document 
            await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .doc(request.body.sectionDocument)
            .collection('items')
            .doc(request.body.itemDocument)
            .delete();

            //Get the updated Container Row Section Items 
            const updatedContainerRowSectionItemInfo = await admin.firestore()
            .collection('containers')
            .doc(request.body.containerDocument)
            .collection('rows')
            .doc(request.body.rowDocument)
            .collection('sections')
            .doc(request.body.sectionDocument)
            .collection('items')
            .get()
            .then(async (querySnapshot) => {
                let allItems:Promise<any>[] = [];
                let items = await querySnapshot.docs.map(async (doc) => {
                    let m = await admin.firestore()
                    .collection('containers')
                    .doc(request.body.containerDocument)
                    .collection('rows')
                    .doc(request.body.rowDocument)
                    .collection('sections')
                    .doc(request.body.sectionDocument)
                    .collection('items')
                    .doc(doc.id)
                    .get();
                    const itemInfo = {...m.data(), name: doc.id}
                    return itemInfo;
                });
                allItems = items;
                const allItemSnapshot = await Promise.all(allItems);
                return allItemSnapshot;
            });

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({...updatedItem.data(), name: request.body.data.name, allItems:updatedContainerRowSectionItemInfo});
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const deleteContainerRowSectionItem = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            let containerDocumentName = request.query.container_document;
            let rowDocumentName = request.query.row_document;
            let sectionDocumentName = request.query.section_document;
            let itemDocumentName = request.query.item_document;

            //Remove old documet in container row section collection
            await admin.firestore()
            .collection('containers')
            .doc(`${containerDocumentName}`)
            .collection('rows')
            .doc(`${rowDocumentName}`)
            .collection('sections')
            .doc(`${sectionDocumentName}`)
            .collection('items')
            .doc(`${itemDocumentName}`)
            .delete();

            const results = await admin.firestore()
            .collection('containers')
            .doc(`${containerDocumentName}`)
            .collection('rows')
            .doc(`${rowDocumentName}`)
            .collection('sections')
            .doc(`${sectionDocumentName}`)
            .collection('items')
            .get()
            .then(async (querySnapshot) => {
                let allItems:Promise<any>[] = [];
                const sections = await querySnapshot.docs.map(async (doc) => {
                    const k = await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocumentName}`)
                    .collection('rows')
                    .doc(`${rowDocumentName}`)
                    .collection('sections')                    
                    .doc(`${sectionDocumentName}`)
                    .collection('items')
                    .doc(doc.id)
                    .get();
                    const itemInfo = {...k.data(), name:doc.id}
                    return itemInfo;
                });
                allItems = sections;
                const allItemsSnapshot = await Promise.all(allItems);
                return allItemsSnapshot;
            });
            
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const createContainerRowSectionItem = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            let containerDocument = request.body.containerDocument;
            let rowDocument = request.body.rowDocument;
            let sectionDocument = request.body.sectionDocument;
            let itemDocument = request.body.data.name;

            await admin.firestore()
            .collection('containers')
            .doc(`${containerDocument}`)
            .collection('rows')
            .doc(`${rowDocument}`)
            .collection('sections')
            .doc(`${sectionDocument}`)
            .collection('items')
            .doc(`${itemDocument}`)
            .set({
                order: request.body.data.order
            });

            const allItems = await admin.firestore()
            .collection('containers')
            .doc(`${containerDocument}`)
            .collection('rows')
            .doc(`${rowDocument}`)
            .collection('sections')
            .doc(`${sectionDocument}`)
            .collection('items')
            .get()
            .then(async (querySnapshot) => {
                let allItems:Promise<any>[] = [];
                const items = await querySnapshot.docs.map(async (doc) => {
                    let l = await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocument}`)
                    .collection('rows')
                    .doc(`${rowDocument}`)
                    .collection('sections')
                    .doc(`${sectionDocument}`)
                    .collection('items')
                    .doc(doc.id)
                    .get();
                    const itemInfo = {...l.data(), name:doc.id}
                    return itemInfo;
                });
                allItems = items;
                const itemSnapshot = await Promise.all(allItems);
                return itemSnapshot;
            });

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({allItems:allItems});
        }

        catch (err) {
            console.log(err)
            response.status(500).send(err);
        }
    });
});

export const createContainerRowSection = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            let containerDocument = request.body.containerDocument;
            let rowDocument = request.body.rowDocument;
            let sectionDocument = request.body.data.name;

            await admin.firestore()
            .collection('containers')
            .doc(`${containerDocument}`)
            .collection('rows')
            .doc(`${rowDocument}`)
            .collection('sections')
            .doc(`${sectionDocument}`)
            .set({
                label: request.body.data.label,
                order: request.body.data.order,
                width: request.body.data.width
            });

            const results = await admin.firestore()
            .collection('containers')
            .doc(`${containerDocument}`)
            .collection('rows')
            .doc(`${rowDocument}`)
            .collection('sections')
            .get()
            .then(async (querySnapshot) => {
                let allSections:Promise<any>[] = [];
                const sections = await querySnapshot.docs.map(async (doc) => {
                    const m = await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocument}`)
                    .collection('rows')
                    .doc(`${rowDocument}`)
                    .collection('sections')
                    .doc(doc.id)
                    .get();
                    const itemsOfSection = await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocument}`)
                    .collection('rows')
                    .doc(`${rowDocument}`)
                    .collection('sections')
                    .doc(doc.id)
                    .collection('items')
                    .get()
                    .then(async (querySnapshot) => {
                        let allItems:Promise<any>[] = [];
                        const items = await querySnapshot.docs.map(async (doc2) => {
                            const l = await admin.firestore()
                            .collection('containers')
                            .doc(`${containerDocument}`)
                            .collection('rows')
                            .doc(`${rowDocument}`)
                            .collection('sections')
                            .doc(doc.id)
                            .collection('items')
                            .doc(doc2.id)
                            .get();
                            const itemInfo = {...l.data(), name:doc2.id}
                            return itemInfo;
                        });
                        allItems = items;
                        const allItemsSnapshot = await Promise.all(allItems);
                        return allItemsSnapshot;
                    });
                    const sectionInfo = {...m.data(), name:doc.id, items: itemsOfSection}
                    return sectionInfo;
                });
                allSections = sections;
                const allSectionsSnapshot = await Promise.all(allSections);
                return allSectionsSnapshot;
            });
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }
        
        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const createContainerRow = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            let containerDocument = request.body.containerDocument;
            let rowDocument = request.body.data.name;

            await admin.firestore()
            .collection('containers')
            .doc(`${containerDocument}`)
            .collection('rows')
            .doc(`${rowDocument}`)
            .set({
                align: request.body.data.align,
                label: request.body.data.label,
                order: request.body.data.order,
                width: request.body.data.width
            });

            const results = await admin.firestore()
            .collection('containers')
            .doc(`${containerDocument}`)
            .collection('rows')
            .get()
            .then(async (querySnapshot) => {
                let allRows:Promise<any>[] = [];
                const rows = await querySnapshot.docs.map(async (doc) => {
                    const k = await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocument}`)
                    .collection('rows')
                    .doc(doc.id)
                    .get();
                    const sectionsOfRow = await admin.firestore()
                    .collection('containers')
                    .doc(`${containerDocument}`)
                    .collection('rows')
                    .doc(doc.id)
                    .collection('sections')
                    .get()
                    .then(async (querySnapshot) => {
                        let allSections:Promise<any>[] = [];
                        const sections = await querySnapshot.docs.map(async (doc2) => {
                        const m = await admin.firestore()
                        .collection('containers')
                        .doc(`${containerDocument}`)
                        .collection('rows')
                        .doc(doc.id)
                        .collection('sections')
                        .doc(doc2.id)
                        .get();
                        const itemsOfSection = await admin.firestore()
                        .collection('containers')
                        .doc(`${containerDocument}`)
                        .collection('rows')
                        .doc(doc.id)
                        .collection('sections')
                        .doc(doc2.id)
                        .collection('items')
                        .get()
                        .then(async (querySnapshot) => {
                            let allItems:Promise<any>[] = [];
                            const items = await querySnapshot.docs.map(async (doc3) => {
                                const l = await admin.firestore()
                                .collection('containers')
                                .doc(`${containerDocument}`)
                                .collection('rows')
                                .doc(doc.id)
                                .collection('sections')
                                .doc(doc2.id)
                                .collection('items')
                                .doc(doc3.id)
                                .get();
                                const itemInfo = {...l.data(), name:doc3.id}
                                return itemInfo;
                            });
                            allItems = items;
                            const allItemsSnapshot = await Promise.all(allItems);
                            return allItemsSnapshot;
                        });
                        const sectionInfo = {...m.data(), name:doc2.id, items:itemsOfSection}
                        return sectionInfo;
                    });
                        allSections = sections;
                        const allSectionsSnapshot = await Promise.all(allSections);
                        return allSectionsSnapshot;
                    });
                    const rowInfo = {...k.data(), name:doc.id, sections:sectionsOfRow}
                    return rowInfo;
                });
                allRows = rows;
                const allRowsSnapShot = await Promise.all(allRows);
                return allRowsSnapShot;
            });
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const createContainer = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            let containerDocument = request.body.data.name;

            await admin.firestore()
            .collection('containers')
            .doc(`${containerDocument}`)
            .set({
                align:request.body.data.align,
                label:request.body.data.label,
                width:request.body.data.width
            });

            const results = await admin.firestore()
            .collection('containers')
            .get()
            .then(async (querySnapshot) => {
                let allContainers:Promise<any>[] = [];
                const containers = await querySnapshot.docs.map(async (doc) => {
                    const q = await admin.firestore()
                    .collection('containers')
                    .doc(doc.id)
                    .get();
                    const rowsOfContainer = await admin.firestore()
                    .collection('containers')
                    .doc(doc.id)
                    .collection('rows')
                    .get()
                    .then(async (querySnapshot) => {
                        let allRows:Promise<any>[] = [];
                        const rows = await querySnapshot.docs.map(async (doc2) => {
                            const k = await admin.firestore()
                            .collection('containers')
                            .doc(doc.id)
                            .collection('rows')
                            .doc(doc2.id)
                            .get();
                            const sectionsOfRow = await admin.firestore()
                            .collection('containers')
                            .doc(doc.id)
                            .collection('rows')
                            .doc(doc2.id)
                            .collection('sections')
                            .get()
                            .then(async (querySnapshot) => {
                                let allSections:Promise<any>[] = [];
                                const sections = await querySnapshot.docs.map(async (doc3) => {
                                    const m = await admin.firestore()
                                    .collection('containers')
                                    .doc(doc.id)
                                    .collection('rows')
                                    .doc(doc2.id)
                                    .collection('sections')
                                    .doc(doc3.id)
                                    .get();
                                    const itemsOfSection = await admin.firestore()
                                    .collection('containers')
                                    .doc(doc.id)
                                    .collection('rows')
                                    .doc(doc2.id)
                                    .collection('sections')
                                    .doc(doc3.id)
                                    .collection('items')
                                    .get()
                                    .then(async (querySnapshot) => {
                                        let allItems:Promise<any>[] = [];
                                        const items = await querySnapshot.docs.map(async (doc4) => {
                                            const l = await admin.firestore()
                                            .collection('containers')
                                            .doc(doc.id)
                                            .collection('rows')
                                            .doc(doc2.id)
                                            .collection('sections')
                                            .doc(doc3.id)
                                            .collection('items')
                                            .doc(doc4.id)
                                            .get();
                                            const itemInfo = {...l.data(), name:doc4.id}
                                            return itemInfo;
                                        });
                                        allItems = items;
                                        const allItemsSnapshot = await Promise.all(allItems);
                                        return allItemsSnapshot;
                                    });
                                    const sectionInfo = {...m.data(), name:doc3.id, items:itemsOfSection}
                                    return sectionInfo;
                                });
                                allSections = sections;
                                const allSectionsSnapshot = await Promise.all(allSections);
                                return allSectionsSnapshot;
                            });
                            const rowInfo = {...k.data(), name:doc2.id, sections:sectionsOfRow}
                            return rowInfo;
                        });
                        allRows = rows;
                        const allRowsSnapshot = await Promise.all(allRows);
                        return allRowsSnapshot;
                    });
                    const containerInfo = {...q.data(), name: doc.id, rows:rowsOfContainer}
                    return containerInfo;
                });
                allContainers = containers;
                const allContainersSnapshot = await Promise.all(allContainers);
                return allContainersSnapshot;
            });
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }   

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const getActions = functions.https.onRequest(async (request, response) => {
    cors(request, response , async () => {
        try {
            let actionParam = request.query.actions;
            if(!actionParam) {
                actionParam = "actions";
            }

            let results = await admin.firestore()
            .collection(`${actionParam}`)
            .get()
            .then(async (querySnapshot) => {
                let allActions:Promise<any>[] = [];
                const item = await querySnapshot.docs.map(async (doc) => {
                    const p = await admin.firestore()
                    .collection(`${actionParam}`)
                    .doc(doc.id)
                    .get();
                    const actionInfo = {...p.data(), name: doc.id}
                    return actionInfo;
                });
                allActions = item;
                const allActionsSnapshot = await Promise.all(allActions);
                return allActionsSnapshot;
            });
            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send(results);
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const createAction = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            let objectParam = request.body.data.object;
            await admin.firestore()
            .collection('actions')
            .doc("view" + objectParam + "action")
            .set({
                label: request.body.data.label,
                object: request.body.data.object,
                order: request.body.data.order,
                relativelink: request.body.data.relativelink,
                showIcon: request.body.data.showIcon,
                showLabel: request.body.data.showLabel,
                icon: request.body.data.icon,
                container: request.body.data.container
            });

            const addedActionInfo = await admin.firestore()
            .collection('actions')
            .doc("view" + objectParam + "action")
            .get();

            const action = addedActionInfo.data();
            let returnAction = action;

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({...returnAction, name: "view" + request.body.data.object + "action"});
        }

        catch (err) 
        {
            console.log(err);
            response.status(500).send(err);
        }
    });
});

export const updateAction = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try{
            // let actionDocument = request.body.actionDocument;
            let newActionDocument = "view" + request.body.data.object + "action";

            // await admin.firestore()
            // .collection('actions')
            // .doc(`${actionDocument}`)
            // .delete();

            await admin.firestore()
            .collection('actions')
            .doc(`${newActionDocument}`)
            .set({
                label: request.body.data.label,
                object: request.body.data.object,
                order: request.body.data.order,
                relativelink: request.body.data.relativelink,
                showIcon: request.body.data.showIcon,
                showLabel: request.body.data.showLabel,
                icon: request.body.data.icon,
                container: request.body.data.container
            });

            const updatedActionInfo = await admin.firestore()
            .collection('actions')
            .doc(`${newActionDocument}`)
            .get();

            const action = updatedActionInfo.data();
            let returnAction = action;

            response.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.send({...returnAction, name: newActionDocument});
        }

        catch (err) {
            console.log(err);
            response.status(500).send(err);
        }
    });
});
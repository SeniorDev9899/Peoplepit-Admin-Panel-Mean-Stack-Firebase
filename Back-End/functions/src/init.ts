import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const initConfig = {
    objects: [
        { name: "people", label: "People", key: "P-" },
        { name: "conditions", label: "Medical Conditions", key: "C-" }
    ],
    fields: [
        { name: "firstname", label: "First Name", type: "simpletext" },
        { name: "lastname", label: "Last Name", type: "simpletext" },
        { name: "address", label: "Address", type: "simpletext" },
        { name: "dob", label: "Date of Birth", type: "date" },
        { name: "salary", label: "Salary", type: "number" },
        {
            name: "bloodtype", label: "Blood Type", type: "single-autocomplete",
            options: [
                { name: "opos", label: "O+" },
                { name: "oneg", label: "O-" },
                { name: "apos", label: "A+" },
                { name: "aneg", label: "A-" },
                { name: "bpos", label: "B+" },
                { name: "bneg", label: "B-" },
                { name: "abpos", label: "AB+" },
                { name: "abneg", label: "AB-" }
            ]
        },
        {
            name: "gender", label: "Gender", type: "singleselect",
            options: [
                { name: "male", label: "Male" },
                { name: "female", label: "Female" }
            ]
        },
        {
            name: "nationalities", label: "Nationalities", type: "multi-autocomplete",
            options: [
                    { name: "afghan", label: "Afghan" },
                    { name: "albanian", label: "Albanian" },
                    { name: "algerian", label: "Algerian" },
                    { name: "argentine", label: "Argentine" },
                    { name: "argentinian", label: "Argentinian" },
                    { name: "australian", label: "Australian" },
                    { name: "austrian", label: "Austrian" },
                    { name: "bangladeshi", label: "Bangladeshi" },
                    { name: "belgian", label: "Belgian" },
                    { name: "bolivian", label: "Bolivian" },
                    { name: "batswana", label: "Batswana" },
                    { name: "brazilian", label: "Brazilian" },
                    { name: "bulgarian", label: "Bulgarian" },
                    { name: "cambodian", label: "Cambodian" },
                    { name: "cameroonian", label: "Cameroonian" },
                    { name: "canadian", label: "Canadian" },
                    { name: "chilean", label: "Chilean" },
                    { name: "chinese", label: "Chinese" },
                    { name: "colombian", label: "Colombian" },
                    { name: "costarican", label: "Costa Rican" },
                    { name: "croatian", label: "Croatian" },
                    { name: "cuban", label: "Cuban" },
                    { name: "czech", label: "Czech" },
                    { name: "danish", label: "Danish" },
                    { name: "dominican", label: "Dominican" },
                    { name: "ecuadorian", label: "Ecuadorian" },
                    { name: "egyptian", label: "Egyptian" },
                    { name: "salvadorian", label: "Salvadorian" },
                    { name: "english", label: "English" },
                    { name: "estonian", label: "Estonian" },
                    { name: "ethiopian", label: "Ethiopian" },
                    { name: "fijian", label: "Fijian" },
                    { name: "finnish", label: "Finnish" },
                    { name: "french", label: "French" },
                    { name: "german", label: "German" },
                    { name: "ghanaian", label: "Ghanaian" },
                    { name: "greek", label: "Greek" },
                    { name: "guatemalan", label: "Guatemalan" },
                    { name: "haitian", label: "Haitian" },
                    { name: "honduran", label: "Honduran" },
                    { name: "hungarian", label: "Hungarian" },
                    { name: "icelandic", label: "Icelandic" },
                    { name: "indian", label: "Indian" },
                    { name: "indonesian", label: "Indonesian" },
                    { name: "iranian", label: "Iranian" },
                    { name: "iraqi", label: "Iraqi" },
                    { name: "irish", label: "Irish" },
                    { name: "israeli", label: "Israeli" },
                    { name: "italian", label: "Italian" },
                    { name: "jamaican", label: "Jamaican" },
                    { name: "japanese", label: "Japanese" },
                    { name: "jordanian", label: "Jordanian" },
                    { name: "kenyan", label: "Kenyan" },
                    { name: "kuwaiti", label: "Kuwaiti" },
                    { name: "lao", label: "Lao" },
                    { name: "latvian", label: "Latvian" },
                    { name: "lebanese", label: "Lebanese" },
                    { name: "libyan", label: "Libyan" },
                    { name: "lithuanian", label: "Lithuanian" },
                    { name: "malagasy", label: "Malagasy" },
                    { name: "malaysian", label: "Malaysian" },
                    { name: "malian", label: "Malian" },
                    { name: "maltese", label: "Maltese" },
                    { name: "mexican", label: "Mexican" },
                    { name: "mongolian", label: "Mongolian" },
                    { name: "moroccan", label: "Moroccan" },
                    { name: "mozambican", label: "Mozambican" },
                    { name: "namibian", label: "Namibian" },
                    { name: "nepalese", label: "Nepalese" },
                    { name: "dutch", label: "Dutch" },
                    { name: "newzealand", label: "New Zealand" },
                    { name: "nicaraguan", label: "Nicaraguan" },
                    { name: "nigerian", label: "Nigerian" },
                    { name: "norwegian", label: "Norwegian" },
                    { name: "pakistani", label: "Pakistani" },
                    { name: "panamanian", label: "Panamanian" },
                    { name: "paraguayan", label: "Paraguayan" },
                    { name: "peruvian", label: "Peruvian" },
                    { name: "philippine", label: "Philippine" },
                    { name: "polish", label: "Polish" },
                    { name: "portuguese", label: "Portuguese" },
                    { name: "romanian", label: "Romanian" },
                    { name: "russian", label: "Russian" },
                    { name: "saudi", label: "Saudi" },
                    { name: "scottish", label: "Scottish" },
                    { name: "senegalese", label: "Senegalese" },
                    { name: "serbian", label: "Serbian" },
                    { name: "singaporean", label: "Singaporean" },
                    { name: "slovak", label: "Slovak" },
                    { name: "southafrican", label: "South African" },
                    { name: "korean", label: "Korean" },
                    { name: "spanish", label: "Spanish" },
                    { name: "srilankan", label: "Sri Lankan" },
                    { name: "sudanese", label: "Sudanese" },
                    { name: "swedish", label: "Swedish" },
                    { name: "swiss", label: "Swiss" },
                    { name: "syrian", label: "Syrian" },
                    { name: "taiwanese", label: "Taiwanese" },
                    { name: "tajikistani", label: "Tajikistani" },
                    { name: "thai", label: "Thai" },
                    { name: "tongan", label: "Tongan" },
                    { name: "tunisian", label: "Tunisian" },
                    { name: "turkish", label: "Turkish" },
                    { name: "ukrainian", label: "Ukrainian" },
                    { name: "emirati", label: "Emirati" },
                    { name: "british", label: "British" },
                    { name: "american", label: "American" },
                    { name: "uruguayan", label: "Uruguayan" },
                    { name: "venezuelan", label: "Venezuelan" },
                    { name: "vietnamese", label: "Vietnamese" },
                    { name: "welsh", label: "Welsh" },
                    { name: "zambian", label: "Zambian" },
                    { name: "zimbabwean", label: "Zimbabwean" }
            ]
        }
    ],
    containers: [
        {
            name: "addpeoplecontainer", label: "Add People Container", width: "90", align: "center",
            rows: [
                {
                    name: "firstrow", label: "First Row", order: "1", align: "space-between", width: "100",
                    sections: [
                        {
                            name: "leftsection", label: "Left Section", order: "1", width: "60",
                            items: [
                                { name: "firstname", order: "1" },
                                { name: "lastname", order: "2" },
                                { name: "address", order: "3" }
                            ]
                        },
                        {
                            name: "rightsection", label: "Right Section", order: "2", width: "30",
                            items: [
                                { name: "gender", order: "1" },
                                { name: "bloodtype", order: "2" },
                                { name: "dob", order: "3" }
                            ]
                        }
                    ]
                },
                {
                    name: "secondrow", label: "Second Row", order: "2", align: "center", width: "100",
                    sections: [
                        {
                            name: "onlysection", label: "Only Section", order: "1", width: "100",
                            items: [
                                { name: "nationalities", order: "1" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "medicalconditionscontainer", label: "Medical Conditions Container", width: "90", align: "center",
            rows: [
                {
                    name: "firstrow", label: "First Row", order: "1", align: "space-between", width: "100",
                    sections: [
                        {
                            name: "onlysection", label: "Only Section", order: "1", width: "100",
                            items: [
                                { name: "firstname", order: "1" },
                                { name: "lastname", order: "2" },
                                { name: "address", order: "3" }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    actions: [
        {name: 'viewpeopleaction', order: '1', label: 'People', object: 'people', relativelink:'view', icon: 'person', showIcon: 'true', showLabel: 'true', container: 'addpeoplecontainer'},
        {name: 'viewconditionsaction', order: '2', label: 'Medical Conditions', object: 'conditions', relativelink:'view', icon: 'medical_services', showIcon: 'true', showLabel: 'true', container: 'medicalconditionscontainer'}

    ],
    menu: [
        {name: 'peoplemenu', action: 'viewpeopleaction'},
        {name: 'conditionsmenu', action: 'viewconditionsaction'}
    ],
    defaults: [
        {defaultobject: 'people', 
        defaultactions: [
            {object: 'people', defaultobject: 'reports', defaultaction: 'view', defaultkey: 'R-1627'},
            {object: 'conditions', defaultobject: 'conditions', defaultaction: 'add'}
        ]}
    ],
    data: [
        {key: 'P-1', object: 'people', fields: [
            {name: 'bloodtype', values: ['opos']},
            {name: 'firstname', values: ['Pierre']},
            {name: 'lastname', values: ['EL KHOURY']},
            {name: 'gender', values: ['male']},
            {name: 'nationalities', values: ['lebanese', 'french', 'lithuanian']}
        ]}
    ]
}


export const config = functions.https.onRequest((request, response) => {

    //initialize objects
    initConfig.objects.forEach(object => {
        admin.firestore().collection("objects").doc(object.name).set({ label: object.label, key: object.key });
    });

    //initialize fields
    initConfig.fields.forEach(field => {
        admin.firestore().collection("fields").doc(field.name).set({ label: field.label, type: field.type });
        if (field.options) {
            field.options.forEach(option => {
                admin.firestore().collection("fields").doc(field.name).collection("options").doc(option.name).set({ label: option.label });
            });
        }
    });

    //initialize containers
    initConfig.containers.forEach(container => {
        admin.firestore().collection("containers").doc(container.name).set({ label: container.label, align: container.align, width: container.width });
        //rows
        if (container.rows) {
            container.rows.forEach(row => {
                const parent = admin.firestore().collection("containers").doc(container.name);
                parent.collection("rows").doc(row.name).set({ label: row.label, align: row.align, width: row.width, order: row.order });
                //sections
                if (row.sections) {
                    row.sections.forEach(section => {
                        const parent = admin.firestore().collection("containers").doc(container.name).collection("rows").doc(row.name);
                        parent.collection("sections").doc(section.name).set({ label: section.label, width: section.width, order: section.order });
                        //items
                        if (section.items) {
                            section.items.forEach(item => {
                                const parent = admin.firestore().collection("containers").doc(container.name).collection("rows").doc(row.name).collection("sections").doc(section.name);
                                parent.collection("items").doc(item.name).set({ order: item.order });
                            });
                        }
                    });
                }
            });
        }
    });

    //initialize actions
    initConfig.actions.forEach(action => {
        admin.firestore().collection("actions").doc(action.name).set(
            {
                label: action.label,
                order: action.order,
                object: action.object,
                relativelink: action.relativelink,
                icon: action.icon,
                showIcon: action.showIcon,
                showLabel: action.showLabel,
                container: action.container
            }
        );
    });

    //intialize menu
    initConfig.menu.forEach(menu => {
        admin.firestore().collection("menu").doc(menu.name).set({action: menu.action});
    })

    //intialize data
    initConfig.data.forEach(data => {
        admin.firestore().collection("data").doc(data.key).set({object: data.object});
        if (data.fields) {
            data.fields.forEach(field => {
                console.log(field.values)
                admin.firestore().collection("data").doc(data.key).collection('fields').doc(field.name)
                .set({values: field.values});
            });
        }
    })
    
    response.send("Initialized PeoplePit.");

});

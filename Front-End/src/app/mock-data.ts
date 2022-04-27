import { Fields } from './classes/fields';
import { Options } from './classes/options';
import { Sections, SectionFields } from './classes/sections';
import { Objects } from './classes/objects';
import { Actions } from './classes/actions';

export const GENDER_OPTIONS: Options[] = [ 
  { name: "male", label: "Male" },
  { name: "female", label: "Female" }];
export const BLOOD_TYPE_OPTIONS: Options[] = [
   { name: "opos", label: "O+" },
              { name: "oneg", label: "O-" },
              { name: "apos", label: "A+" },
              { name: "aneg", label: "A-" },
              { name: "bpos", label: "B+" },
              { name: "bneg", label: "B-" },
              { name: "abpos", label: "AB+" },
              { name: "abneg", label: "AB-" }
];
export const NATIONALITIES_OPTIONS: Options[] = [{ name: "afghan", label: "Afghan" },
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
              { name: "zimbabwean", label: "Zimbabwean" }];

export const FIRSTNAME: Fields = { name:'firstname', label: 'First Name', values: ['Pierre'], type: 'simpletext'};
export const LASTNAME: Fields = { name:'lastname', label: 'Last Name', values: [], type: 'simpletext'};
export const ADDRESS: Fields ={ name:'address', label: 'Address', values: [], type: 'simpletext'};
export const REVENUE: Fields ={ name:'monthlyrevenue', label: 'Monthly Revenue', values: ['4568349'], type: 'number'};
export const BLOODTYPE: Fields ={ name:'bloodtype', label: 'Single Blood Type', values: ['3'], type: 'single-autocomplete', options: BLOOD_TYPE_OPTIONS };
export const GENDER: Fields ={ name:'gender', label: 'Gender', values: ['1'], type: 'singleselect', options: GENDER_OPTIONS };
export const DOB: Fields ={ name:'dob', label: 'Date of Birth', values: ['20200131'], type: 'date'};
export const NATIONALITIES: Fields ={ name:'naionalities', label: 'Nationalities', values: ['30', '7', '12', '76'], type: 'multi-autocomplete', options: NATIONALITIES_OPTIONS };
export const PHOTO: Fields ={ name:'photo', label: 'Photo', values: [], type: 'image'};
export const NOTES: Fields ={ name:'notes', label: 'Notes', values: [], type: 'textarea' };
export const PROOFOFADDRESS: Fields ={ name:'proofofaddress', label: 'Proof of Address', values: [], type: 'attachment' };

export const LEFT_SECTION_FIELDS: SectionFields[] = [
  {order: 5, field: FIRSTNAME},
  {order: 2, field: LASTNAME},
  {order: 4, field: ADDRESS}
]

export const RIGHT_SECTION_FIELDS: SectionFields[] = [
  {order: 1, field: GENDER},
  {order: 2, field: BLOODTYPE},
  {order: 3, field: DOB}
]

export const BOTTOM_SECTION_FIELDS: SectionFields[] = [
  {order: 1, field: NATIONALITIES}
]



export const MAIN_SECTION: Sections = 
  {id: 1, order: 1, name: 'MainSection', align: 'space-between', width: 100, type: 'row', sections: [ //row section must be 100% width
    {id: 2, order: 1, name: 'LeftSection', width: 60, type: 'item', section_fields: LEFT_SECTION_FIELDS},
    {id: 3, order: 2, name: 'RightSection', width: 30, type: 'item', section_fields: RIGHT_SECTION_FIELDS}
  ]}  


export const OTHER_SECTION: Sections = 
  {id: 1, order: 2, name: 'SecondarySection', align: 'center', width: 100,  type: 'row', sections: [ //row section must be 100% width
    {id: 3, order: 1, name: 'RightSection',  width: 100, type: 'item', section_fields: BOTTOM_SECTION_FIELDS}
  ]}


export const ALL_SECTIONS: Sections = 
  {id: 1, order: 1, name: 'AllSections', width: 90,  type: 'container', align: 'center', sections: [MAIN_SECTION, OTHER_SECTION]}


export const PEOPLE: Objects = 
  {id: 1, name:'people', label:'People', key:'P', url:"people"}

export const CONDITIONS: Objects = 
  {id: 2, name:'conditions', label:'Conditions', key:'C', url:'conditions'}

export const MEDICINES: Objects = 
  {id: 3, name:'medicines', label:'Medicines', key:'M', url:'medicines'}

export const EQUIPMENT: Objects = 
  {id: 4, name:'equipment', label:'Equipment', key:'E', url:'equipment'}

export const PEOPLE_MENU_ACTION: Actions = 
  {name: '1', order: 1, label: 'People', object: 'people', icon: 'person', showIcon: true, showLabel: true, screen: ALL_SECTIONS}

export const CONDITIONS_MENU_ACTION: Actions = 
  {name: '2', order: 2, label: 'Medical Conditions', object: 'conditions', icon: 'medical_services', showIcon: true, showLabel: true, screen: MAIN_SECTION}

export const MENU: Actions[] = [
  PEOPLE_MENU_ACTION,
  CONDITIONS_MENU_ACTION
]
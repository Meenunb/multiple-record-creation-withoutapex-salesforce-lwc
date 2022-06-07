import { LightningElement ,wire, track} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import SIZE_FIELD from '@salesforce/schema/Account.Size__c';
import STATUS_FIELD from '@salesforce/schema/Account.Status__c';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import CONTACT_ACCOUNT_Id_FIELD from '@salesforce/schema/Contact.AccountId';
import CONTACT_FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import EVENT_COORDINATOR_OBJECT from '@salesforce/schema/Event_Coordinator__c';
import EVENT_COORDINATOR_ACCOUNT_NAME_OBJECT from '@salesforce/schema/Event_Coordinator__c.Account_Name__c';
import EVENT_COORDINATOR_FIRST_NAME_OBJECT from '@salesforce/schema/Event_Coordinator__c.First_Name__c';
import EVENT_COORDINATOR_LAST_NAME_OBJECT from '@salesforce/schema/Event_Coordinator__c.Last_Name__c';
import EVENT_COORDINATOR_EMAIL_OBJECT from '@salesforce/schema/Event_Coordinator__c.EC_Email__c';

export default class DemoForm extends LightningElement {

accountName = '';
accountWebiste = '';
accountIndustry = '';
accountSize = '';
accountStatus='';
contactFirstName = '';
contactLastName = '';
contactEmail = '';
eventcoordinatorFirstName = '';
eventcoordinatorLastName = '';
eventcoordinatorEmail = '';

value='';


@track isSize1to10= true;



// to get the default record type id, if you dont' have any recordtypes then it will get master
@wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
accountMetadata;

// now get the industry picklist values
@wire(getPicklistValues,{recordTypeId: '$accountMetadata.data.defaultRecordTypeId', fieldApiName: INDUSTRY_FIELD })
optionsIndustry;

@wire(getPicklistValues,{recordTypeId: '$accountMetadata.data.defaultRecordTypeId', fieldApiName: SIZE_FIELD })
optionsSize;

@wire(getPicklistValues,{recordTypeId: '$accountMetadata.data.defaultRecordTypeId', fieldApiName: STATUS_FIELD })
optionsStatus;

handleNameChange( event ) {
    this.accountName = event.target.value;
    //console.log( 'Account Name is', this.accountName );
}


handleWebisteChange( event ) {
    this.accountWebiste = event.target.value;
    //console.log( 'Webiste is', this.accountWebiste );
}


handleIndustryChange ( event ) {
    this.accountIndustry = event.target.value;
    //console.log( 'Industry is', this.accountIndustry );  
}

handleSizeChange ( event ) {
    this.accountSize = event.target.value;
    //console.log('here is....'+this.accountSize);
    if(this.accountSize == '1-10'){
        this.isSize1to10= false;
        this.accountStatus='Ineligible';
}
else
    this.isSize1to10= true;
    //console.log( 'Size is', this.accountSize );
}

handleStatusChange  (event ) {
    this.accountStatus = event.target.value;
    //console.log( 'Status is', this.accountStatus );
}

handleCFirstNameChange( event ) {
        this.contactFirstName = event.target.value;
        //console.log( 'Contact FirstName is', this.contactFirstName );
}

handleCLastNameChange( event ) {
        this.contactLastName = event.target.value;
        //console.log( 'Contact LastName is', this.contactLastName );
}

handleCEmailChange ( event ) {
        this.contactEmail = event.target.value;
        //console.log( 'Contact Email is', this.contactEmail );
}

handleECFirstNameChange (  event ) {
        this.eventcoordinatorFirstName = event.target.value;
        //console.log( 'Event Coordinator FirstName is', this.eventcoordinatorFirstName );
}

handleECLastNameChange (  event ) {
        this.eventcoordinatorLastName = event.target.value;
        //console.log( 'Event Coordinator LastName is', this.eventcoordinatorLastName );
}

handleECEmailChange (  event ) {
        this.eventcoordinatorEmail = event.target.value;
        //console.log( 'Event Coordinator Email is', this.eventcoordinatorEmail );
}


createRecords() {
var isEventValidation = this.validateFields();
var isAccountValidation = this.accountFields();
if(!isAccountValidation){
    let fields = {};
        fields[ ACCOUNT_NAME_FIELD.fieldApiName ] = this.accountName;
        fields[ WEBSITE_FIELD.fieldApiName ] = this.accountWebiste;
        fields[ INDUSTRY_FIELD.fieldApiName ] = this.accountIndustry;
        //console.log('Industry is', this.accountIndustry );
        fields[ SIZE_FIELD.fieldApiName ] = this.accountSize;
        //console.log('Size is', this.accountSize );
        fields[ STATUS_FIELD.fieldApiName ] = this.accountStatus;
        //console.log('Status is', this.accountStatus );
        //console.log( 'Account Fields are', JSON.stringify( fields ) );
        const recordAccountInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
        createRecord( recordAccountInput )

.then( account => {
        fields = {};
        fields[ CONTACT_ACCOUNT_Id_FIELD.fieldApiName ] = account.id;
        fields[ CONTACT_FIRST_NAME_FIELD.fieldApiName ] = this.contactFirstName;
        fields[ CONTACT_LAST_NAME_FIELD.fieldApiName ] = this.contactLastName;
        fields[ CONTACT_EMAIL_FIELD.fieldApiName ] = this.contactEmail;
        //console.log( 'Contact Fields are', JSON.stringify( fields ) );
        const recordContactInput = { apiName: CONTACT_OBJECT.objectApiName, fields };
        createRecord( recordContactInput )

        
.then( contact => {
        console.log( 'Contact Id is', contact.id );
        
alert('Please enter contact last name');
        
})


.then( Event_Coordinator__c => {
        fields = {};
        fields[ EVENT_COORDINATOR_ACCOUNT_NAME_OBJECT.fieldApiName ] = account.id;
        fields[ EVENT_COORDINATOR_FIRST_NAME_OBJECT.fieldApiName ] = this.eventcoordinatorFirstName;
        fields[ EVENT_COORDINATOR_LAST_NAME_OBJECT.fieldApiName ] = this.eventcoordinatorLastName;
        fields[ EVENT_COORDINATOR_EMAIL_OBJECT.fieldApiName ] = this.eventcoordinatorEmail;


        console.log( 'Event Coordinator fields are', JSON.stringify( fields ) );
        const recordEventCoordinatorInput = { apiName: EVENT_COORDINATOR_OBJECT.objectApiName, fields };


        if(!isEventValidation){
        createRecord( recordEventCoordinatorInput )
.then( Event_Coordinator__c => {
        console.log( 'Event Coordinator Id is', Event_Coordinator__c.id);
})
/*.catch( error => {
        console.log( 'Error while creating Event Coordinator ', JSON.stringify( error ) );
        this.dispatchEvent(
        new ShowToastEvent( {
        title: 'Event Coordinator Creation failed ',
        message: 'Event Coordinator Creation failed',
        variant: 'error',
}), 
);
});*/

 this.dispatchEvent(
        new ShowToastEvent( {
        title: 'Success',
        message: 'Account ,Contact and Event Coordinator records created successfully!',
        variant: 'success',
}),
)}

else
      alert('Event Record is not created')  ;
}) 



//alert('Con And eve Record is not created')  ;
/*.catch( error => {
        console.log( 'Error while creating Contact ', JSON.stringify( error ) );
        this.dispatchEvent(
        new ShowToastEvent( {
        title: 'Account Created',
        message: 'Contact Creation failed',
        variant: 'error',
}),
);
}); */
})
/*.catch( error => {
        console.log( 'Error while creating Account ', JSON.stringify( error ) );
        this.dispatchEvent(
        new ShowToastEvent( {
        title: 'Account Creation failed ',
        message: 'Account Creation failed',
        variant: 'error',
}),
);
}); */
}
} 
accountFields(){
const websiteRegex=/^((http|https):)??(www[.])??([a-zA-Z0-9]|-)+?([.][a-zA-Z0-9(-|/|=|?)??]+?)+?$/;
        let website = this.template.querySelector('.website');
        let account_valid = false
        if(website.value.match(websiteRegex)){
                website.setCustomValidity("");
        }else{
                website.setCustomValidity("Please enter valid website");
                account_valid = true;
        }
        website.reportValidity();
        let indus = this.template.querySelector('.indus');
        if(indus.value==''){
                indus.setCustomValidity("Please select any field");
                account_valid = true;
        }else{
                indus.setCustomValidity("");
        }
        indus.reportValidity();
        return account_valid;
}

validateFields(){
        var isValidation = true;
        this.template.querySelectorAll('.eclname').forEach(eventNames => {
        if(eventNames.value != ''){
                isValidation=false;
                //console.log('validation true');
        }else{
                eventNames.setCustomValidity("");
        }
        eventNames.reportValidity();
});

this.template.querySelectorAll('lightning-input').forEach(element => {
    element.reportValidity();
});
const websiteRegex=/^((http|https):)??(www[.])??([a-zA-Z0-9]|-)+?([.][a-zA-Z0-9(-|/|=|?)??]+?)+?$/;
        let website = this.template.querySelector('.website');
        if(website.value.match(websiteRegex)){
        website.setCustomValidity("");

}else{
        //isValidation=true;
        website.setCustomValidity("Please enter valid website");
}
        website.reportValidity();


const emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.template.querySelectorAll(".email").forEach(email => {
        if(email.value.match(emailRegex) || email.value==''){
                if(email.title == 'Event Email' && email.value !=''){
                        isValidation=false;
                }
                email.setCustomValidity("");
        }else{
                email.setCustomValidity("Please enter valid email");
                //isValidation=true;
        }
        email.reportValidity();
});
        return isValidation;
}

cancelMethod( event ) {
        const inputFields = this.template.querySelectorAll( 'lightning-input' );
        //console.log('============',inputFields );
        if ( inputFields ) {
        inputFields.forEach( field => {
        field.value='';
});
}

const inputFieldsothers = this.template.querySelectorAll( 'lightning-combobox' );
        //console.log('============',inputFields );
        if ( inputFieldsothers ) {
                inputFieldsothers.forEach( field => {
        field.value='';

});
}
}
}
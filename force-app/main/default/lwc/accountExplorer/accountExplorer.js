import { LightningElement,track,wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountExplorerController.getAccounts';
import getContactsByAccount from '@salesforce/apex/AccountExplorerController.getContactsByAccount';
import createContact from '@salesforce/apex/AccountExplorerController.createContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountExplorer extends LightningElement {
    @track accounts;
    @track selectedContacts;
    @track selectedAccountId;
    @track selectedAccountName;
    @track showModal = false;
    @track newContact = {};

    accountColumns = [
        {label: 'Name', fieldName:'Name'},
        {label:'Industry',fieldName:'Industry'},
        {type:'button',typeAttributes: { label: 'View Contacts', name: 'view', variant:'brand'}}
    ];

    contactColumns = [
        {label:'Name',fieldName:'Name'},
        {label:'Email',fieldName:'Email'},
        {label:'Phone',fieldName:'Phone'}
    ];

    @wire(getAccounts)
    wiredAccounts({data,error}){
        if(data){
            this.accounts = data;
        }else if(error){
            this.ShowToast('Error loading accounts',error.body.message,'error');
        }
    }

    handleRowAction(event){
        const account = event.detail.row;
        this.selectedAccountId = account.Id;
        this.selectedAccountName = account.Name;

        getContactsByAccount({accountId: this.selectedAccountId}).
        then(result => {
            this.selectedContacts = result;
            console.log('result',result);
        })
        .catch(error => {
            this.showToast('Error loading contacts',error.body.message,'error');
        });
    }

    openModal(){
        this.newContact = {AccountId: this.selectedAccountId};
        this.showModal = true;
    }

    closeModal(){
        this.showModal = false;
    }

    handleInputChange(event){
        const field = event.target.dataset.field;
        this.newContact[field] = event.target.value;
    }

    createNewContact(){
        createContact({ con: this.newContact})
        .then(result => {
            this.showToast('Success','Contact created successfully','success');
            this.closeModal();
            return getContactsByAccount({accountId : this.selectedAccountId});
        })
        .then(updatedContacts => {
            this.selectedContacts = updatedContacts;
        })
        .catch(error => {
            this.showToast('Error creatingcontact',error.body.message,'error');
        });
    }

    showToast(title,message,variant){
        this.dispatchEvent(new ShowToastEvent({title,message,variant}));
    }

}
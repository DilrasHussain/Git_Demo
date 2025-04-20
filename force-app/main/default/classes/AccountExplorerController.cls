public with sharing class AccountExplorerController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        try {
            return [SELECT Id,Name,Industry FROM Account LIMIT 50];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsByAccount(Id accountId){
        return [SELECT Id,Name,Email,Phone FROM Contact WHERE AccountId =: accountId];

    }

    @AuraEnabled
    public static Contact createContact(Contact con){
        try {
            insert con;
            return con;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
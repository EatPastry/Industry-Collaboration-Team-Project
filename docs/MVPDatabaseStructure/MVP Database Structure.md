# MVP Database Structure

As per the task requirements, the database design has been done in Visual Paradigm, with the necessary fields to meet the MVP, that being the userID, partnerID, transactionAmount fields.

To meet normalisation standards, we created a 4th field, the “transactionID” field. All the required fields are not unique and could therefore not be used as a primary key, and a composite key was also not appropriate since its possible to have two entries where all 3 fields, the user, partner, and amount are all identical. The transactionID field acts as a identifier for each transaction, it is not nullable, and always unique. 

To meet the MVP requirements, the userID and the partnerID can be regular not nullable fields, if the project progresses beyond the MVP stage, these will be foreign key relations to other tables. However, for the MVP requirements, we only need to display any sort of limited user data to show product functionality, for this reason we kept the database structure as simple as possible.

## Diagram

<img src = "MVP Database Structure.png" alt="MVP Database Structure" style = "width : 40%">


## Fields

- transactionID: varchar(string), unique, not nullable, primary key to identify each transaction
- userID: varchar(string), not nullable, links the transaction with a user, if project progresses beyond MVP, will be a foreign key
- partnerID: varchar(string), not nullable, links the transaction with a partner, if project progresses beyond MVP, will be a foreign key
- transactionAmount: double(10), not nullable, defines a cost per transaction

All our identification fields are strings because they will likely be randomly generated unique identifiers which contain characters and numbers.

Our transactionAmount is a double since it needs to store decimal values since transactions can contain pence, for now we are assuming only one form of currency to meet MVP standards.
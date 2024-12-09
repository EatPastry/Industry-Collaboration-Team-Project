# Backend Documentation for UNiDAYS Recapped

## Table of Contents
1. [MVP Database Structure](#mvp-database-structure)
2. [Research on Database Services for UNiDAYS Recapped](#research-on-database-services-for-unidays-recapped)
3. [Creating the Database](#creating-the-database)
4. [Creating the Cronjob](#creating-the-cronjob)

---

### Diagram
![MVP Database Structure](MVP%20Database%20Structure.png)

### Fields
- **transactionID**: `varchar(string)`, unique, not nullable, primary key to identify each transaction.
- **userID**: `varchar(string)`, not nullable.
- **partnerID**: `varchar(string)`, not nullable.
- **transactionAmount**: `double(10)`, not nullable.

### Design Rationale
- Identification fields are `string` to accommodate alphanumeric unique identifiers.
- `transactionAmount` is a `double` to support decimal values.
# MVP Database Structure

As per the task requirements, the database design has been created in Visual Paradigm, with the necessary fields to meet the MVP, including `userID`, `partnerID`, and `transactionAmount`.

To meet normalisation standards, a fourth field, `transactionID`, was added. All the required fields are not unique and could therefore not be used as a primary key, and a composite key was also not appropriate since its possible to have two entries where all 3 fields, the user, partner, and amount are all identical. The transactionID field acts as a identifier for each transaction, it is not nullable, and always unique. 

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

---

## Research on Database Services for UNiDAYS Recapped

### Overview
To ensure secure storage and presentation of user data, we researched several database services, comparing them based on security, scalability, suitability, and cost.

### Database Options
#### 1. Supabase
- **Security**: Row-level security, AES-256 encryption, OAuth Single Sign-On.
- **Scalability**: Serverless architecture for automatic scaling.
- **Suitability**: Familiar to the team; efficient integration for faster development.
- **Cost**: Free/paid tiers.

#### 2. Firebase
- **Security**: Customizable security rules and MFA.
- **Scalability**: Google infrastructure ensures robust performance.
- **Suitability**: Real-time data synchronization improves user experience.
- **Cost**: Free/paid tiers.

#### 3. Amazon RDS
- **Security**: Strong encryption, virtual private cloud isolation.
- **Scalability**: Dynamic scaling to meet project needs.
- **Suitability**: Excels in relational data handling.
- **Cost**: Pay-as-you-go.

#### 4. MongoDB Atlas
- **Security**: Encryption, auditing, access controls.
- **Scalability**: Horizontal scaling for large data volumes.
- **Suitability**: Flexible document storage for unstructured data.
- **Cost**: Variable pricing.

#### 5. PlanetScale
- **Security**: Fine-grained access control, encryption.
- **Scalability**: Serverless, auto-scaling for fluctuating workloads.
- **Suitability**: MySQL compatibility with serverless features.
- **Cost**: Free tier.

### Recommendation
Based on our team's familiarity, Supabase was chosen for the initial MVP development. Future stages may consider Amazon RDS or MongoDB Atlas for advanced requirements.

---

## Creating the Database

### Steps Taken
1. Created an organization and project on Supabase.
2. Designed and implemented the table schema with fields planned during the database design phase.

#### Example Table Schema
- **transactionID**: Randomly generated UID.
- **userID**: User identifier.
- **partnerID**: Partner identifier.
- **transactionAmount**: Transaction value in decimal format.

### Access Configuration
For the MVP, anonymous access was allowed to meet minimal requirements without implementing a full authentication system.

### Data Population
Sample data was added to validate functionality.

---

## Creating the Cronjob

### Tools and Configuration
Using **cron-job.org**, we set up a cronjob to ping the database once a day to ensure uptime and stability.

### Testing and Results
A successful test run confirmed the functionality of the cronjob.

---

## Conclusion
This document compiles the backend work done for the UNiDAYS Recapped project, demonstrating adherence to software engineering practices and project management principles.

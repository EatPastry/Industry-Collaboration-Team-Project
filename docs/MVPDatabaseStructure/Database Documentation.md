# Research on Database Services for UNiDAYS Recapped
<p>We did research on several databases as a service to identify which one is most appropriate for our secure storage and presentation of user data, in addition to a case study of each service in terms of security, scalability, and suitability for a data frontend presentation.</p>

<p>Our go-to option for our database was Supabase since we have all previously used it in the first year for our databases and interfaces module. However, before we started our scrum, Joshua and Alex from UNiDAYS suggested that we research other databases that may be more suitable for Recapped.</p>

## 1. Supabase


- **Overview:**<br>Supabase is a service built on top of Postgres, with real-time features and a broad selection of in-built functionality such as authentication and API generation. It’s positioned as an open-source alternative to Firebase.

- **Security Features:**<br>Row-level security, which offers point-and-click granular data access control to end users. MFA, SOC2, All customer data is encrypted at rest with AES-256 and in transit via TLS. Sensitive information like access tokens and keys are encrypted at the application level before they are stored in the database. OAuth Single Sign-On can also used to store, transmit and encrypt data through HTTPS. 
<mark>It is also of significant importance to follow the privacy policy of UNiDAYS Recapped, as this will then give the ability to control the individual rights of access for a given user.</mark>

- **Scalability:**<br>Supabase's serverless architecture makes it easy to automatically scale as the amount of input increases, giving a stable base on which to build if the application grows. Scaling to this extent is well aligned with our need for a flexible, resilient backend.

- **Suitability:**<br>Supabase is particularly appealing because of our deep involvement with it. This familiarity enables quick configuration and better integration, reducing development time and freeing us to devote time to other activities of our documentation and delivery.

- **Considerations:**<br>Because Supabase is open-source, it could not have as many integration options as some of the larger, more well-known platforms, but for this project, we believe that it is suitable for the time being.

- **Cost:**<br>We have all used Supabase for free without any issue.

## 2. Firebase

- **Overview:**<br>Firebase, developed by Google, is a strong NoSQL database with real-time data capabilities and smooth integration with other Google services.

- **Security:**<br>Firestore in Firebase provides customisable security rules, allowing us to adjust access levels based on each user’s role. Might bring up some issues if we are unable to figure out how Firebase Security Rules language works. Also has MFA.

- **Scalability:**<br>With Google infrastructure, it is very scalable and guarantees a stable high performance for variable data loads. It is convenient as it ensures robustness regardless of whether the UNiDAYS Recapped application can be made available to a wider subset of users.

- **Suitability:**<br>The real-time data synchronisation by Firebase can improve the user experience through on-the-fly updates on the client side. This capability helps us get closer to realising that vision of a more effective and more interactive user experience.

- **Drawbacks:**<br>Firebase is essentially a NoSQL service so the service may lack some complex query features. Also, in the case of this limitation, it is of interest to document it regarding the future organisation and exploitation of data.

- **Cost:**<br>Firebase offers both free and a pay-as-you-go service.

## 3. Amazon RDS

- **Overview:**<br>Amazon RDS delivers a fully managed relational database solution that supports MySQL, PostgreSQL, and several other databases.

- **Security:**<br>Amazon RDS includes strong security, like encryption at rest and in transit, and virtual private cloud isolation. <mark>This in turn guarantees a high degree of security grounding our aspiration for effective data protection of UNiDAYS user data.</mark>

- **Scalability:**<br>RDS supports dynamic scaling and is able to scale resources in response to the demand. This scalability provides flexibility, in that as the project develops—for example, by incorporating new features or new user data in subsequent stages of the project.

- **Suitability:**<br>Amazon RDS excels at structured and relational data handling. It offers a powerful querying capacity, making it a good choice for reporting jobs or convoluted data relationships. However, unlike Supabase or Firebase, it does not include the function to monitor data updates in real-time. If we were to include real-time monitor capabilities we would have to integrate with Amazon Cloudwatch.

- **Drawbacks:**<br>Amazon RDS comes with a more complex configuration and administration so it can hinder us development process. The intention of this service, nevertheless, would entail the provision of both the establishment and continuation of resources.

- **Cost:**<br>Amazon RDS operates on a pay-for-use basis. The price includes storage and instance charges, which depends on the usage and size. Amazon does offer an AWS free tier though limited.

## 4. MongoDB Atlas

- **Overview:**<br>MongoDB Atlas is a managed NoSQL database as a service with a hallmark flexible document-oriented model and is thus very amenable to the inherent unstructured data.

- **Security:**<br>MongoDB Atlas supports several security capabilities: encryption, auditing, and access controls.

- **Scalability:**<br>Horizontal scalability via sharding is offered by MongoDB Atlas, making it an appropriate solution for workloads that subsequently require large data volumes and storage capacity.

- **Suitability:**<br>MongoDB's document structure allows for flexible data storage, making it a good choice if our project involves varying types of user data, such as shopping preferences, order histories, and personalised offers. However, it is not ideal for data that has complex relationships between its variables.

## 5. PlanetScale

- **Overview:**<br>PlanetScale is a cloud-based MySQL-compatible database that offers serverless auto-scaling. Using Vitess, it is suitable for scenarios without the requirement to scale but without the need for server management, etc.

- **Security:**<br>PlanetScale also provides encryption and fine-grained access control, which is consistent with our security goals of preventing the exposure of user data.

- **Scalability:**<br>PlanetScale provides serverless, auto-scaled, high-performance applications with fluctuating user requirements. This capability is the basis of our project objective of scalable demand-adaptive scaling.

- **Suitability:**<br>As Opendata does not offer our exact planetary dataset, PlanetScale may present a suitable relational database solution to our project if the client lists a classical SQL schema combined with serverless flexibility.

- **Drawbacks:**<br>Being relatively new, PlanetScale may lack some of the extensive features offered by older services.

- **Cost:**<br>PlanetScale offers a free tier, but the expenses may vary with its use. Including cost documentation will help in long-term planning.

### Comparison Table
| Database     | Security            | Scalability           | Cost       | Suitability                         | Drawbacks                    |
|--------------|---------------------|-----------------------|------------|-------------------------------------|-----------------------------|
| Supabase     | Row-level security  | Serverless scaling    | Free/paid       | Familiarity with tools              | Limited integrations        |
| Firebase     | Role-based rules    | Google infrastructure | Free/paid | Real-time sync for user interaction | NoSQL format limitations    |
| Amazon RDS   | Strong encryption   | Dynamic scaling       | Pay-as-you-go | Relational data handling           | Complex setup              |
| MongoDB Atlas| Encryption, access  | Horizontal scaling    | Varies     | Flexible document storage           | Weak relational capabilities|
| PlanetScale  | Fine-grained access | Serverless auto-scale | Free tier  | MySQL compatibility                 | Limited features (new)      |


## Conclusion and Recommendation
<p>There are a variety of functionalities that each database service is suited to as part of various stages of the UNiDAYS Recapped project. On the basis of our team's experience with Supabase, its real-time features, and security, it seems to be best suited for our first development. Nevertheless, we need to keep the profile open to move into Amazon RDS or MongoDB Atlas when the requirements of the project need more advanced data structures or when scalability is necessary and advanced querying features are required.
</p>
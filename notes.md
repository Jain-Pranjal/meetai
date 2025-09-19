
## Steps to Setup
0. next js setup
1. drizzle setup 
2. better-auth setup
3. trpc setup using tanstack query  [LINK](https://trpc.io/docs/client/tanstack-react-query/server-components)
4. nuqs setup
5. stream setup
6. ngrok setup
7. inngest setup
8. polar setup


for the drizzle :
[https://orm.drizzle.team/docs/get-started/neon-new]

npm i drizzle-orm @neondatabase/serverless dotenv
npm i -D drizzle-kit tsx
npx drizzle-kit push  
<!-- we can directly push the schema to the database or we can first migrate and then push to database-->

for the better-auth:
[https://www.better-auth.com/docs/installation]
npx @better-auth/cli generate
<!-- use this to generate the better auth schema  -->


for the stream:
npm i @stream-io/node-sdk (backend)
npm i @stream-io/video-react-sdk (frontend)

- so we need to store all the schema in the single file only as that file is responsible for pushing the schema to the database. so also put the better-auth schema in the same file. and then push it 

- we are Managing the database connection with the drizzle only so we will use only the drizzle migration command for the better-auth schema as well. 

- we can use the zod library for both client and server side validation. so front me bas vo user experience koo refine karta hai lkein backend me it used for the validation of the data that we are entering into the database. 
## we will not be migrating the schema using the better-auth migration command as we are using drizzle for everything. so use the drizzle migration command to migrate the better-auth schema as well.


- in tRPC basically we will do the prefetch in the server side and then we will use the data in the client side. so we will use the `useQuery` hook from `@tanstack/react-query` to call the function and get the data. So it will be much faster to get the data

- 99% times we will use the tRPC on the client side only as it is used to fetch the data from the server and then render it on the client side. 

- we can call the tRPC funciton or procedures dirreclty from the server also by preserving the auth state. it will directly call the procedure nnot making any req.


# Error Solving
```bash
# SERVER_ERROR:  [Error [BetterAuthError]: [# Drizzle Adapter]: The model "user" was not found in the schema object. Please pass the schema directly to the adapter options.] {
  cause: undefined
}

- for solving this error we need to pass the FullSchema to the better-auth adapter options in the auth.ts file
```





# IMP
- we need to change the github and google redirect url in production : For production, you should set it to the URL domain of your application
- also dont add logo in google auth as it will take sometime and make sure to publish it to use in the production.
- try to use the **explicit checking of the protected routes** in the all file ratherr than middleware as it will be easier to debug and also it will be more readable.
- **credentials** are using the **router.push** and **socials** are using the **callBackUrl**
- as we know that fetching the data from the server is much faster than fetching it from the client side, so we will **prefetch** the data from the server component and then it will stored in the cache and then we can access it from the client side using the `useQuery` hook from `@tanstack/react-query`.
- we will load the data in the server and render by suspense in client adnd 100% make sure that it will handle the loading and error by itlsef
- if we are doing the ***prefetching*** of the data in the server side then we must have to use the ***useSuspenseQuery*** hook and also we explicitlly dont need to handle the loading and error as useSuspense will handle it for us. just we need to wrap the component with the hydration boundary ,error boundary and suspense boundary.
- for fetching the data using the drizzle returns data from the database as an array of objects
- drizzle by default returns the data in the form of an **array of objects**, so we need to destructure it to get the first object from the array. 
- we need to do the invalidate the query after the mutation is done so that the data is updated in the cache and we can see the updated data in the client side.
- the props in the prefetching on server side and client side fetching needs to be same as it will give the unauthorized error if the props are not same due to fallback to useQuery which does not have the auth state.
- the form to create render on the main page where we need to invalidate the getMany whereas the form to edit will be rendered in the [id] page where we need to invalidate the getOne query and getMany both as data is added to both them.
- we add the webhook url in the reciever application
- ngrok is used to expose the localhost to the internet so that we can test the webhooks as they work only on the https urls.
- Ngrok is a tool jo tumhare local development server ko publicly accessible URL (usually HTTPS) de deta hai.

## webhook flow 
the stream dashboard has the webhookurl that send to the server. jab bhi apaka koi bhi event trigger hoga to vo webhook url par request bhejega and vo aapki server par aayega and vaha jo bhi function aapne likha hoga vo execute hoga. 

```bash
🔁 Full Flow Simplified:
- User ne koi action kiya (e.g., payment, document verified, order placed)
- External service (e.g., Stripe, ShuftiPro, GitHub) ne notice kiya ki event trigger hua
- Unhone tumhare diye gaye Webhook URL pe POST request bhej di
- Tumhare server ke endpoint pe wo request aayi
- Tumne usme se event type check kiya
- Us event type ke hisaab se code run kiya (e.g., DB update, user ko email, etc.)
- Tumne 200 OK return kiya → Bataya ke "haan bhai, mil gaya"
```


## nuqs setup
- basically nuqs is used to manage the state of the application and it is used to sync the state with the search params. so we will use it to manage the state of the filters in the agent list page.
- u need to sync both the client side and server side state with the same params that u had made the state of :- like u had made the state of "search" then u need to make sure that the server side also has the same state for "search" and any other filters that u are using. (params.ts) 

- so for syncing the state we need to make the params.ts file and then use the same state there also  
- then pass the same filters on the client as well as server side so that we can use the same state everywhere.
- by clicking the next and prev it will udpate the query params in the url and then it will again prefetch the data from the server side with the udpated query params and then it will render the data on the client side.



## stream setup
- so we need to setup the server side client for the stream video call service and then we can use it to create the video call service. (lib folder stream.ts)
- need to upsert the users and agents both so that they can join the call and also we need to generate the token for the user to access the stream video call service.
- the call will have the same id as the meeting id as call is the meeting only. so whenever we create a meeting we will create a call with the same id and then we can use that call id to join the call. 
- upsert the user into the stream backend so that it can make the token from the data that is present in the stream backend and only allows that user to join the call.
- basically the flow is that on every meeting creation we will create a call and its info will be stored in the stream backend and also it will add the agents data in the stream backend + for the user we will upsert the user and generate the token for the user to join the call.
- A channel in Stream is a core object representing a dedicated conversation space. It holds messages, members, watchers, and other channel-specific data.


## polar
- using the sandbox :- make a token in the settings
- integrate the polar with the better-auth - [Link](https://docs.polar.sh/integrate/sdk/adapters/better-auth#%40polar-sh%2Fbetter-auth)
- add the plugin in the better-auth config file
- also add the polar client in the client instacne of better-auth
- polar db users's *external id* matches exactly with the better-auth user id in the neon database.
- initially i dont have any limit so user can make unlimited meet and agents but i have set the limit for the free one so if user buy any sub then limit will be removed and user can make unlimited meet and agents.



## deployement 
- deploy on vercel and get the domaain
- add the domain to stream webhook url
- add the domain to github login (homepage url and callback url)
- add the domain to google login (authorized redirect uri and authorised domaion (branding) and javaScript origins)
- connect inngest to the vercel project by removeing the protection 
- basically we need to copy the vercel bypass automation and then paste it in the inngest project and then it will connect the inngest to the vercel project. Add the key in deployment protection key



## Docker Setup
- if we just change the code in host machine then it will reflect in the container as well as we have mounted the volume. .:/app 
- but if we **change the dependencies** then we need to **rebuild** the image and then run the container again. 
```bash
docker-compose -f docker-compose.dev.yml up --build

# the --build flag is used to rebuild the image if there is any change in the dependencies.
```

Workflow

First time: container build → node_modules install → named volume me store ho gaya.

Code changes: no rebuild needed (bind mount code sync karega).

New dependency: docker compose up --build → fresh install → named volume overwrite ho jata hai.
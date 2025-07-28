"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Loading } from "@/components/Loading";
import { Error } from "@/components/ErrorState";
import { useTRPC } from "@/trpc/client";
import { PricingCard } from "../components/PricingCard";

export const UpgradeView = () => { 

    const trpc=useTRPC();

    // this will give us the products array
    const {data:products}=useSuspenseQuery(trpc.premium.getProducts.queryOptions());
    const{data:currentSubscription}=useSuspenseQuery(trpc.premium.getCurrentSubscription.queryOptions());

// The current subscription is the product only as it is the same product we are upgrading to


    return (
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-10">
            <div className="flex-1 mt-4 flex-col flex gap-y-10 items-center">
                <h5 className="font-medium text-2xl md:text-3xl">
                    You are on the{" "}
                    <span className="font-semibold text-blue-600">
                        { currentSubscription?.name ?? "Free"} 
                    </span>{" "}
                    plan
                </h5>

                {/* AS THE SUBSCRIPTION IS THE PRODUCT ONLY SO WE WILL DISPLAY ALL THE NAMES OF THE PRODCUT ALONG WITH DETAILS WHICH ARE ITSELF IS A SUBSCRIPTION PLAN*/}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map((product) => {
                        const isCurrentProduct = currentSubscription?.id === product.id;
                        const isPremium = !!currentSubscription; //boolean

                        let buttonText = "Upgrade";
                        let onClick = () => {
                            authClient.checkout({
                                products: [product.id],
                            });
                        };

                        if (isCurrentProduct) {
                            buttonText = "Manage";
                            onClick = () => {
                                authClient.customer.portal();
                            }
                        } else if (isPremium) {
                            buttonText = "Change Plan";
                            onClick = () => {
                                authClient.customer.portal()
                            };
                        }

                        return (
                           <PricingCard
                               key={product.id}
                               variant={product.metadata.variant==="highlighted"? "highlighted" : "default"}
                               buttonText={buttonText}
                               onClick={onClick}
                               title={product.name}
                               description={product.description}
                               price={product.prices[0].amountType==="fixed"? product.prices[0].priceAmount/100:0} //as they are in cents
                               priceSuffix={`/${product.prices[0].recurringInterval}`}
                               features={product.benefits.map((benefit) => benefit.description)}
                               badge={product.metadata.badge as string | null}
                           />
                        );
                    })}
                </div>
            </div>
        </div>
    )}


// the metadata is set in the polar dashboard



export const UpgradeViewLoading = () => {
    return (
        <Loading title='Loading Upgrade' description='Please wait while we load the upgrade options.' />
    )
}

export const UpgradeViewError = () => {
    return (
        <Error
            title="Error loading upgrade options"
            description="Please try again later."
        />
    )
}
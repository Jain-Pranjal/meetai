import {CircleCheckIcon} from "lucide-react";
import { cva,type VariantProps } from "class-variance-authority";
import {cn} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// to make the diff variants we use the cva function from class-variance-authority

const pricingCardVariants = cva("rounded-lg p-4 py-6 w-full",{
    variants: {
        variant: {
            default: "bg-white text-black",
            highlighted:"bg-linear-to-br from-[#4f46e5] to-[#3b82f6]"
        },
    },
    defaultVariants: {
        variant: "default",

    },  
})
const pricingCardIconVariants = cva("size-5",{
    variants: {
        variant: {
            default: "fill-primary text-white",
            highlighted:"fill-white text-black"
        },
    },
    defaultVariants: {
        variant: "default",

    },  
})
const pricingCardBadgeVariants = cva("text-black text-xs font-normal p-1",{
    variants: {
        variant: {
            default: "bg-primary/20",
            highlighted:"bg-[#4f46e5]/20"
        },
    },
    defaultVariants: {
        variant: "default",

    },  
})
const pricingCardSecondaryTextVariant = cva("text-neutral-700",{
    variants: {
        variant: {
            default: "text-neutral-700",
            highlighted:"text-neutral-300"
        },
    },
})


interface Props extends VariantProps <typeof pricingCardVariants> {
    badge?:string|null,
    title:string,
    features:string[],
    price:number,
    description?:string|null,
    className?:string,
    buttonText:string,
    onClick?: () => void,
    priceSuffix:string

}


export const PricingCard = ({
    badge,
    title,
    features,
    price,
    description,
    className,
    buttonText,
    onClick,
    priceSuffix,
    variant = "default" //no need to pass variant in interface , will be handled by VariantProps
}: Props) => {
    return (
       <div className={cn(pricingCardVariants({variant}),className,"border")}>
           <div className="flex items-end gap-x-4 justify-between">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                    <h6 className="font-medium text-xl">{title}</h6>
                    {badge ? (
                        <Badge className={cn(pricingCardBadgeVariants({variant}))}>
                            {badge}
                        </Badge>
                    ) : null}
                </div>
                    <p className={cn("text-xs",pricingCardSecondaryTextVariant({variant}))}>{description}</p>
            </div>

            {/* Formatting the price */}
                    <div className="flex shrink-0 items-end gap-x-0.5">
                        <h4 className="text-3xl font-medium">
                            {Intl.NumberFormat("en-US",{
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(price)}
                        </h4>
                        <span className={cn(pricingCardSecondaryTextVariant({variant}))}>{priceSuffix}</span>
                    </div>
           </div>
                    <div className="py-6">
                        <Separator className="opacity-10 text-neutral-200" />
                    </div>
                    <Button className="w-full" size="lg" variant={variant === "highlighted" ? "default" : "outline"}
                    onClick={onClick}>{buttonText}</Button>

                    <div className="flex flex-col gap-y-2 mt-6">
                        <p className="font-medium uppercase" >Features:</p>
                        <ul className={cn("flex flex-col gap-y-2.5",pricingCardSecondaryTextVariant({variant}))}>
                           {features.map((feature,index) => (
                            <li key={index} className="flex items-center gap-x-2.5">
                                <CircleCheckIcon className={cn(pricingCardIconVariants({variant}))} />
                                {feature}
                            </li>
                           ))}
                        </ul>
                    </div>
       </div>
    );
}

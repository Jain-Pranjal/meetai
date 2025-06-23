// modular form for the create agent dialog and update agent dialog
import { AgentGetOne } from "@/modules/agents/types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { agentInsertSchema } from "@/modules/agents/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { generatedAvatar } from "@/components/generated-avatar";
import { toast } from "sonner";


interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne
}

// these initial values will be used to populate the form when editing an agent


export const AgentForm: React.FC<AgentFormProps> = ({onSuccess,onCancel,initialValues}) => {

    const trpc=useTRPC();
    const queryClient=useQueryClient();


    // api call to create an agent
    const createAgent=useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess:async()=>{
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

                
                onSuccess?.();
            },

            // we need to invalidate the queries to refetch the data after creating or updating an agent

            onError: (error) => {
                toast.error(error.message || "Failed to create agent");
            }
        })
    );




    const updateAgent=useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess:async()=>{
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

                if(initialValues?.id) {
                    await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({ id: initialValues.id }));
                }
                
                onSuccess?.();
            },

            onError: (error) => {
                toast.error(error.message || "Failed to update agent");
            }
        })
    );





    // using the same schema that we used to define input in api call
    const form=useForm<z.infer<typeof agentInsertSchema>>({
        resolver:zodResolver(agentInsertSchema),
        defaultValues:{
            name:initialValues?.name ?? "",
            instructions:initialValues?.instructions ?? ""
        }
    });

    const isEdit=!!initialValues?.id;
    const isPending=createAgent.isPending || updateAgent.isPending;


    const onSubmit=(values : z.infer<typeof agentInsertSchema>) => {
        if (isEdit) {
            updateAgent.mutate({ id: initialValues.id, ...values });
        } else {
            createAgent.mutate(values);
        }
    }



    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
               {generatedAvatar({
                   seed: form.watch("name") || "User",
                   variant: "botttsNeutral",
                   className: "border size-16"
               })}

               <FormField 
               name="name"
               control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. English Tutor" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
               />

               <FormField 
               name="instructions"
               control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g. Provide detailed instructions for the agent." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
               />

               <div className="flex justify-between gap-x-2">    
                {onCancel &&(
                    <Button 
                    variant="destructive"
                    disabled={isPending}
                    type="button"
                    onClick={onCancel}>Cancel</Button>
                )}
                <Button 
                    disabled={isPending}
                    type="submit"
                    >
                    {isEdit ? "Update Agent" : "Create Agent"}
                </Button>


               </div>
            </form>
        </Form>
    );
};

// Actual form will be used in the dialog or wherever needed of the agent creation or update

// ON MUTATION WE NEED TO INVALIDATE THE QUERIES TO REFETCH THE DATA AFTER CREATING OR UPDATING AN AGENT TO REFRESH THE CACHE
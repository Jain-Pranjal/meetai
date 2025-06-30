// modular form for the create agent dialog and update agent dialog
import {MeetingGetOne } from "@/modules/meetings/types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {  meetingInsertSchema} from "@/modules/meetings/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/CommandSelect";
import { generatedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/NewAgentDialog";


interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne
}




// these initial values will be used to populate the form when editing an agent


export const MeetingForm: React.FC<MeetingFormProps> = ({onSuccess,onCancel,initialValues}) => {

    const trpc=useTRPC();
    const queryClient=useQueryClient();

    const [openNewAgentDialog,setOpenNewAgentDialog] = useState(false);
    const [agentSearch,setAgentSearch] = useState("");



    // here fetching the info of all the agents to show in the select dropdown and they are in array so to map them 
    const listOfAgents = useQuery(trpc.agents.getMany.queryOptions({
        pageSize: 100,
        search: agentSearch
    }));
    // this will get retrigger whenever the agentSearch changes and it will refetch the agents with the new search term


    // api call to create a meeting
    const createMeeting=useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess:async(data)=>{
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));

            //the data is getting from the success response of the mutation after creating the meeting
                onSuccess?.(data.id);
            },

            onError: (error) => {
                toast.error(error.message || "Failed to create meeting");
            }
        })
    );




    const updateMeeting=useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess:async()=>{
                
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));

                if(initialValues?.id) {
                    await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: initialValues.id }));
                }
                
                onSuccess?.();
            },

            onError: (error) => {
                toast.error(error.message || "Failed to update meeting");
            }
        })
    );



    // using the same schema that we used to define input in api call
    const form=useForm<z.infer<typeof meetingInsertSchema>>({
        resolver:zodResolver(meetingInsertSchema),
        defaultValues:{
            name:initialValues?.name ?? "",
            agentId:initialValues?.agentId ?? ""
        }
    });

    const isEdit=!!initialValues?.id;
    const isPending=createMeeting.isPending || updateMeeting.isPending;

    const onSubmit=(values : z.infer<typeof meetingInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({ id: initialValues.id, ...values });
        } else {
            createMeeting.mutate(values);
        }
    }



    return (
        <>
        <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />


        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              

               <FormField 
               name="name"
               control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Math Consultations" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
               />

              
               <FormField 
               name="agentId"
               control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Agent</FormLabel>
                        <FormControl>
                            <CommandSelect
                                options={(listOfAgents.data?.items ?? []).map((agent) => ({
                                    id: agent.id,
                                    value: agent.id,
                                    children: (
                                        <div className="flex  items-center gap-x-2">
                                            {generatedAvatar({
                                                seed: agent.name || "User",
                                                variant: "botttsNeutral",
                                                className: "size-6"
                                            })}
                                            <span >{agent.name}</span>
                                        </div>
                                    ),
                                })) ?? []} // if no agents are found, it will return an empty array
                                onSelect={field.onChange}
                                onSearch={setAgentSearch}
                                value={field.value}
                                placeholder="Select an agent"
                            />
                        </FormControl>
                        <FormMessage />


                        <FormDescription>Not Found what your&apos;re looking for?<Button variant="link" onClick={() => setOpenNewAgentDialog(true)}>Create a new agent</Button></FormDescription>
                        
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
                    {isEdit ? "Update Meeting" : "Create Meeting"}
                </Button>


               </div>
            </form>
        </Form>
        </>
    );
};

// Actual form will be used in the dialog or wherever needed of the agent creation or update

// ON MUTATION WE NEED TO INVALIDATE THE QUERIES TO REFETCH THE DATA AFTER CREATING OR UPDATING AN AGENT TO REFRESH THE CACHE
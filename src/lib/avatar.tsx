import { createAvatar } from "@dicebear/core";
import { botttsNeutral,initials } from "@dicebear/collection";

interface AvatarProps {
  seed: string;
  variant: "botttsNeutral" | "initials";
}



export const  generatedAvatarURI = ({ seed, variant }: AvatarProps) => {
    let avatar;

    if(variant === "botttsNeutral") {
        avatar = createAvatar(botttsNeutral, {
            seed,
        });
    } else if (variant === "initials") {
        avatar = createAvatar(initials, {
            seed,
            fontWeight:500,
            fontSize:42
        });
    }
    else {
        throw new Error("Invalid avatar variant");
    }

    return avatar.toDataUri();
};

//this will be used to generate the avatar URI based on the seed and variant provide for the Stream call UI


// this dataURI can be directly used in the src attribute of an img tag 
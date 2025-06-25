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
        });
    }
    else {
        throw new Error("Invalid avatar variant");
    }

    return avatar.toDataUri();
};
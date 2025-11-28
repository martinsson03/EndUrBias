"use client"

import { Input } from "@/components/shadcn/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/ui/nativeSelect";
import { FormEvent, useState } from "react";
import { CvDropzone } from "./cvDropzoneClient";
import { Button } from "@/components/shadcn/ui/button";
import { SubmitApplication } from "@/lib/client/services/applicationService";
import ApplicationSubmitRequest from "@/lib/models/requests/applicationSubmitRequest";
import { id } from "@/lib/models/shared/id";

type ApplyJobClientProps = {
    id?: string,
    jobId: id,
    userId: id
};

// The form that the user will submit to the job note.
export default function ApplyJobClient({ id, jobId, userId }: ApplyJobClientProps) {
    // Set all the form inputs:
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname]   = useState("");
    const [gender, setGender]       = useState("");
    const [email, setEmail]         = useState("");
    const [phone, setPhone]         = useState("");
    const [cv, setCv]               = useState<File | null>(null);

    // When you have submitted the form, this will run.
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault(); // Prevent the framework from taking further actions.

        // Handle the inputs!
        const request: ApplicationSubmitRequest = {
            CV: await cv?.text() ?? "",
            Firstname: firstname,
            Lastname: lastname,
            Phonenumber: phone,
            Mail: email
        };

        const success = await SubmitApplication(request, jobId, userId);
    }
    
    return (
        <div className="flex flex-col items-center gap-5 pt-20">
            <h4 className="text-center font-bold">Application form</h4>

            <form onSubmit={handleSubmit} id={id ?? ""} className="w-full max-w-180 flex flex-col gap-5 pb-10 font-medium text-sm">
                <div className="flex gap-7">
                    <div className="grow">
                        <label htmlFor="firstname">Firstname</label>
                        <Input type="text" id="firstname" value={firstname} placeholder="example" onChange={(e) => setFirstname(e.target.value)}></Input>
                    </div>

                    <div className="grow">
                        <label htmlFor="lastname">Lastname</label>
                        <Input type="text" id="lastname" value={lastname} placeholder="example" onChange={(e) => setLastname(e.target.value)}></Input>
                    </div>
                </div>

                <div className="flex gap-7">
                    <div className="grow">
                        <label htmlFor="email">Email</label>
                        <Input type="email" id="email" value={email} placeholder="example@example.com" onChange={(e) => setEmail(e.target.value)}></Input>
                    </div>

                    <div className="grow">
                        <label htmlFor="phone">Phone</label>
                        <Input type="number" id="phone" value={phone} placeholder="+46 730 00 00 00" onChange={(e) => setPhone(e.target.value)}></Input>
                    </div>
                </div>

                <div className="grow max-w-50">
                    <label htmlFor="gender">Gender</label>
                    <NativeSelect id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <NativeSelectOption value="">Select gender</NativeSelectOption>
                        <NativeSelectOption value="male">Male</NativeSelectOption>
                        <NativeSelectOption value="female">Female</NativeSelectOption>
                        <NativeSelectOption value="other">Other</NativeSelectOption>
                    </NativeSelect>
                </div>

                <div>
                    <label htmlFor="cv">Upload CV (PDF, max 10MB)</label>
                    <CvDropzone id="cv" onFileChange={setCv}></CvDropzone>
                </div>

                <div className="flex justify-center">
                    <Button className="max-w-70 grow">Submit</Button>
                </div>
            </form>
        </div>
    );
}
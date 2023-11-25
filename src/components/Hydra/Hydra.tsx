import { Button, LoadingOverlay, NativeSelect, NumberInput, Stack, TextInput, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { UserGuide } from "../UserGuide/UserGuide";
import { SaveOutputToTextFile } from "../SaveOutputToFile/SaveOutputToTextFile";

const title = "Hydra";
const description =
    "Hydra is a login cracking tool that supports several protocols within " +
    "its attacks. The tool can be applied for cracking singular passwords, " +
    "files, and character sets. These brute-force attacks can be applied to " +
    "SMTP, SSH, NFS,and several other protocols.\n\n" +
    "How to use Hydra:\n\n" +
    "Step 1: Select the Login settings\n" +
    "       E.g. Single Login\n\n" +
    "Step 2: Specify the Username for the Login\n" +
    "       E.g. kali\n\n" +
    "Step 3: Select the Password setting\n" +
    "       E.g. Single Password\n\n" +
    "Step 4: Input password for the Login\n" +
    "       E.g. root\n\n" +
    "Step 5: Select the number of Threads and Service Type\n" +
    "       E.g. 6, SSH\n\n" +
    "Step 6: Enter an IP address and Port number.\n" +
    "       E.g. 192.168.1.1:22\n\n" +
    "Step 7: Click Crack to commence Hydra's operation.\n\n" +
    "Step 8: View the Output block below to view the results";

interface FormValuesType {
    loginInputType: string;
    loginArgs: string;
    passwordInputType: string;
    passwordArgs: string;
    threads: string;
    service: string;
    serviceArgs: string;
    nsr: string;
}

const passwordInputTypes = ["Single Password", "File", "Character Set", "Basic"];
const loginInputTypes = ["Single Login", "File"];
const serviceType = ["SMTP", "SSH"];

const Hydra = () => {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [selectedPasswordInput, setSelectedPasswordInput] = useState("");
    const [selectedLoginInput, setSelectedLoginInput] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [pid, setPid] = useState("");

    let form = useForm({
        initialValues: {
            loginInputType: "",
            loginArgs: "",
            passwordInputType: "",
            passwordArgs: "",
            threads: "6",
            service: "",
            serviceArgs: "",
            nsr: "nsr",
        },
    });

    // Uses the callback function of runCommandGetPidAndOutput to handle and save data
    // generated by the executing process into the output state variable.
    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data); // Update output
    }, []);
    // Uses the onTermination callback function of runCommandGetPidAndOutput to handle
    // the termination of that process, resetting state variables, handling the output data,
    // and informing the user.
    const handleProcessTermination = useCallback(
        ({ code, signal }: { code: number; signal: number }) => {
            if (code === 0) {
                handleProcessData("\nProcess completed successfully.");
            } else if (signal === 15) {
                handleProcessData("\nProcess was manually terminated.");
            } else {
                handleProcessData(`\nProcess terminated with exit code: ${code} and signal code: ${signal}`);
            }
            // Clear the child process pid reference
            setPid("");
            // Cancel the Loading Overlay
            setLoading(false);
        },
        [handleProcessData]
    );
    // Sends a SIGTERM signal to gracefully terminate the process
    const handleCancel = () => {
        if (pid !== null) {
            const args = [`-15`, pid];
            CommandHelper.runCommand("kill", args);
        }
    };

    const onSubmit = async (values: FormValuesType) => {
        setLoading(true);

        const args = [];
        if (selectedLoginInput === "Single Login") {
            args.push(`-l`, `${values.loginArgs}`);
        } else if (selectedLoginInput === "File") {
            args.push(`-L`, `${values.loginArgs}`);
        }
        if (selectedPasswordInput === "Single Password") {
            args.push(`-p`, `${values.passwordArgs}`);
        } else if (selectedPasswordInput === "File") {
            args.push(`-P`, `${values.passwordArgs}`);
        } else if (selectedPasswordInput === "Character Set") {
            args.push(`-x`, `${values.passwordArgs}`);
        } else if (selectedPasswordInput === "Basic") {
            args.push(`-e`, `${values.nsr}`);
        }
        if (values.threads) {
            args.push(`-t ${values.threads}`);
        }
        if (selectedService === "SMTP") {
            args.push(`smtp://${values.serviceArgs}`);
        } else if (selectedService === "SSH") {
            args.push(`ssh://${values.serviceArgs}`);
        } else if (selectedService === "NFS") {
            args.push(`nfs://${values.serviceArgs}`);
        }

        try {
            const result = await CommandHelper.runCommandGetPidAndOutput(
                "hydra",
                args,
                handleProcessData,
                handleProcessTermination
            );
            setOutput(result.output);
        } catch (e: any) {
            setOutput(e.message);
        }
    };

    const clearOutput = useCallback(() => {
        setOutput("");
    }, [setOutput]);

    const isLoginSingle = selectedLoginInput === "Single Login";
    const isLoginFile = selectedLoginInput === "File";
    const isPasswordSingle = selectedPasswordInput === "Single Password";
    const isPasswordFile = selectedPasswordInput === "File";
    const isPasswordSet = selectedPasswordInput === "Character Set";
    const isPasswordBasic = selectedPasswordInput === "Basic";
    const isService = selectedService;

    return (
        <form
            onSubmit={form.onSubmit((values) =>
                onSubmit({
                    ...values,
                    passwordInputType: selectedPasswordInput,
                    loginInputType: selectedLoginInput,
                    service: selectedService,
                })
            )}
        >
            <LoadingOverlay visible={loading} />
            {loading && (
                <div>
                    <Button variant="outline" color="red" style={{ zIndex: 1001 }} onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            )}

            <Stack>
                {UserGuide(title, description)}
                <Grid>
                    <Grid.Col span={12}>
                        <NativeSelect
                            value={selectedLoginInput}
                            onChange={(e) => setSelectedLoginInput(e.target.value)}
                            label={"Login settings"}
                            data={loginInputTypes}
                            required
                            placeholder={"Select logins"}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        {isLoginSingle && (
                            <TextInput
                                {...form.getInputProps("loginArgs")}
                                label={"Specify username"}
                                placeholder={"eg: kali"}
                                required
                            />
                        )}
                        {isLoginFile && (
                            <TextInput
                                {...form.getInputProps("loginArgs")}
                                label={"File path"}
                                placeholder={"eg: /home/kali/Desktop/logins.txt"}
                                required
                            />
                        )}
                    </Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col span={12}>
                        <NativeSelect
                            value={selectedPasswordInput}
                            onChange={(e) => setSelectedPasswordInput(e.target.value)}
                            label={"Password settings"}
                            data={passwordInputTypes}
                            required
                            placeholder={"Select a tool to crack with"}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        {isPasswordSingle && (
                            <TextInput
                                {...form.getInputProps("passwordArgs")}
                                label={"Password"}
                                placeholder={"eg: root"}
                                required
                            />
                        )}
                        {isPasswordFile && (
                            <TextInput
                                {...form.getInputProps("passwordArgs")}
                                label={"File path"}
                                placeholder={"eg: /home/kali/Desktop/pwd.txt"}
                                required
                            />
                        )}
                        {isPasswordSet && (
                            <TextInput
                                {...form.getInputProps("passwordArgs")}
                                label={"Character Set"}
                                placeholder={"eg: 1:5:Aa1"}
                                required
                            />
                        )}
                        {isPasswordBasic && (
                            <TextInput label={"Null, username, reverse username"} disabled placeholder={"nsr"} />
                        )}
                    </Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col span={6}>
                        <NumberInput label={"Threads"} {...form.getInputProps("threads")} defaultValue={6} required />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <NativeSelect
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            label={"Service Type"}
                            data={serviceType}
                            required
                            placeholder={"Select a service"}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        {isService && (
                            <TextInput
                                {...form.getInputProps("serviceArgs")}
                                label={"IP address and Port number"}
                                placeholder={"eg: 192.168.1.1:22"}
                                required
                            />
                        )}
                    </Grid.Col>
                </Grid>
                <Button type={"submit"} color="cyan">
                    Crack
                </Button>
                {SaveOutputToTextFile(output)}
                <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
            </Stack>
        </form>
    );
};

export default Hydra;

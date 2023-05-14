import {Box, Button, Card, CardContent, Stack, TextField, Typography} from "@mui/material";
import {useFormik} from "formik";
import * as Yup from "yup";

const NewContractForm = ({handleSubmit}) => {
    const formik = useFormik({
        initialValues: {
            value: "",
            beneficiary: "",
            arbiter: ""
        },
        onSubmit: (values, formikHelpers) => {
            handleSubmit({...values, value: values.value.toString()}, formikHelpers.resetForm);
        },
        validationSchema: Yup.object({}).shape({
            value: Yup.string().required("Deposit required"),
            beneficiary: Yup.string().required("Beneficiary address required"),
            arbiter: Yup.string().required("Arbiter address required")
        }),
        validateOnChange: true,
        validateOnBlur: true
    });

    return (
        <Card variant="outlined">
            <CardContent>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={2}>
                        <Typography align="center" variant="h4" sx={{color: "text.primary", mb: 1}}>
                            New Contract
                        </Typography>
                        <Box>
                            <Typography variant="body1" sx={{color: "text.secondary", mb: 1}}>
                                Arbiter Address
                            </Typography>
                            <TextField
                                required={true}
                                type="text"
                                value={formik.values.arbiter}
                                placeholder="Enter arbiter address"
                                variant="outlined"
                                fullWidth={true}
                                error={formik.touched.arbiter && Boolean(formik.errors.arbiter)}
                                helperText={formik.errors.arbiter}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="arbiter"
                                size="medium"
                                label="Arbiter Address"
                            />
                        </Box>

                        <Box>
                            <Typography variant="body1" sx={{color: "text.secondary", mb: 1}}>
                                Beneficiary Address
                            </Typography>
                            <TextField
                                required={true}
                                type="text"
                                value={formik.values.beneficiary}
                                placeholder="Enter beneficiary address"
                                variant="outlined"
                                fullWidth={true}
                                error={formik.touched.beneficiary && Boolean(formik.errors.beneficiary)}
                                helperText={formik.errors.beneficiary}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="beneficiary"
                                size="medium"
                                label="Beneficiary Address"
                            />
                        </Box>

                        <Box>
                            <Typography variant="body1" sx={{color: "text.secondary", mb: 1}}>
                                Deposit Amount
                            </Typography>
                            <TextField
                                required={true}
                                type="number"
                                value={formik.values.value}
                                placeholder="Enter deposit amount (in ether)"
                                variant="outlined"
                                fullWidth={true}
                                error={formik.touched.value && Boolean(formik.errors.value)}
                                helperText={formik.errors.value}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="value"
                                size="medium"
                                label="Deposit amount"
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth={true}
                            size="large"
                            variant="contained"
                            color="secondary"
                            sx={{}}>
                            Deploy
                        </Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    )
}

export default NewContractForm;
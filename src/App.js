import {ethers} from 'ethers';
import {useEffect, useState} from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import {
    Alert,
    AlertTitle,
    Box,
    Container,
    Divider,
    Grid,
    LinearProgress,
    Stack,
    Typography,
    CardContent,
    Card,
    Button
} from "@mui/material";
import axios from "axios";
import NewContractForm from "./components/new-contract-form";
import {EH_CONSTANTS} from "./utils/constants";


const provider = new ethers.providers.Web3Provider(window.ethereum);

function App() {
    const [escrows, setEscrows] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState();
    const [signer, setSigner] = useState();

    // useEffect(() => {
    //     async function getAccounts() {
    //         const accounts = await provider.send('eth_requestAccounts', []);
    //         setAccount(accounts[0]);
    //         setSigner(provider.getSigner());
    //     }
    //
    //     getAccounts();
    // }, [account]);

    async function newContract(values, callback) {
        const escrowContract = await deploy(signer, values.arbiter, values.beneficiary, ethers.utils.parseEther(values.value));
        await createEscrow(escrowContract);
        callback();
    }

    useEffect(() => {
        setLoading(true);
        const getEscrows = async () => {
            try {
                const response = await axios({method: 'GET', url: `${EH_CONSTANTS.SERVER_URL}/escrows`});
                setEscrows(response.data.data);
                setLoading(false);
                setError(null);
            } catch (e) {
                const {message} = e.response.data;
                setError(message);
                setLoading(false);
            }
        }
        setLoading(false);
        getEscrows().then(() => console.log('Escrows retrieved'));
    }, []);

    const createEscrow = async escrow => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios({
                method: 'POST',
                url: `${EH_CONSTANTS.SERVER_URL}/escrows`,
                data: escrow
            });
            setEscrows([...escrows, response.data.data]);
            setLoading(false);
            setError(null);
        } catch (e) {
            const {message} = e.response.data;
            setError(message);
            setLoading(false);
        }
    }

    const handleConnect = async () => {
        window.ethereum.enable();
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setSigner(provider.getSigner());
    }

    console.log(account);
    return (
        <Box
            sx={{
                backgroundColor: "background.default",
                minHeight: "100vh",
                maxWidth: "100vw",
                width: "100vw",
                overflowX: "hidden"
            }}>
            {loading && <LinearProgress variant="query" color="secondary"/>}
            <Container sx={{py: 4}}>
                <Stack spacing={4}>
                    <Button
                        onClick={handleConnect}
                        type="submit"
                        fullWidth={true}
                        size="large"
                        variant="contained"
                        color="secondary"
                        sx={{}}>
                        Connect
                    </Button>
                    {error && (<Alert severity="error" variant="standard"><AlertTitle>{error}</AlertTitle></Alert>)}
                    <NewContractForm handleSubmit={newContract}/>
                    <Box>
                        <Stack spacing={4}>
                            <Typography
                                align="center"
                                variant="h4"
                                sx={{color: "text.primary"}}>
                                Existing Contracts
                            </Typography>
                            <Divider variant="fullWidth"/>
                            <Grid container={true} spacing={2}>
                                {escrows.map((escrow, index) => {
                                    return (
                                        <Grid key={index} item={true} xs={12} md={6} lg={4}>
                                            <Escrow
                                                escrows={escrows}
                                                setEscrows={setEscrows}
                                                setError={setError}
                                                escrow={escrow}
                                            />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                            {!loading && escrows?.length === 0 && (
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderWidth: 2,
                                        borderStyle: "dashed",
                                        borderColor: "secondary.main",
                                        height: {xs: 200}
                                    }}>
                                    <Stack
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{height: "100%"}}>
                                        <CardContent>
                                            <Typography
                                                align="center"
                                                variant="h3"
                                                sx={{color: "text.secondary", fontSize: {xs: 20, md: 28, lg: 36}}}>
                                                No contracts available
                                            </Typography>
                                        </CardContent>
                                    </Stack>
                                </Card>
                            )}
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}

export default App;

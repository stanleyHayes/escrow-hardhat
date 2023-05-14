import {Box, Button, Card, CardContent, LinearProgress, Stack, Typography} from "@mui/material";
import {ethers} from "ethers";
import EscrowContract from "./artifacts/contracts/Escrow.sol/Escrow.json";
import {useState} from "react";
import axios from "axios";
import {EH_CONSTANTS} from "./utils/constants";

const provider = new ethers.providers.Web3Provider(window.ethereum);
export default function Escrow({escrow, setEscrows, setError, escrows}) {
    const {address, arbiter, beneficiary, value, approved, _id} = escrow;
    const [loading, setLoading] = useState(false);
    const handleApprove =  async () => {
        setLoading(true);
        const contract =  new ethers.Contract(address, EscrowContract.abi, provider);
        const transaction = await contract.connect(provider.getSigner(0)).approve();
        await transaction.wait();
        contract.on("Approved", async () => {
            try {
                const response = await axios({
                    method: 'PUT',
                    url: `${EH_CONSTANTS.SERVER_URL}/escrows/${_id}`,
                    data: escrow,
                });
                setEscrows(escrows.map(escrow => {
                  if(escrow.address === address) return {...response.data.data};
                  return escrow;
              }))
                setLoading(false);
                setError(null);
            } catch (e) {
                const {message} = e.response.data;
                setError(message);
                setLoading(false);
            }
        });
    }

    return (
        <Card variant="outlined" sx={{}}>
            {loading && <LinearProgress variant="query" color="secondary" /> }
            <CardContent>
                <Stack spacing={2}>
                    <Typography align="center" variant="h5" sx={{color: "text.primary", mb: 1}}>
                        New Contract
                    </Typography>
                    <Box>
                        <Typography variant="body2" sx={{color: "text.secondary", mb: 1}}>
                            Arbiter Address
                        </Typography>
                        <Typography variant="body1" sx={{color: "text.secondary", mb: 1}}>
                            {arbiter}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{color: "text.secondary", mb: 1}}>
                            Beneficiary Address
                        </Typography>
                        <Typography variant="body1" sx={{color: "text.secondary", mb: 1}}>
                            {beneficiary}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{color: "text.secondary", mb: 1}}>
                            Value
                        </Typography>
                        <Typography variant="body1" sx={{color: "text.secondary", mb: 1}}>
                            {`${value} ETH`}
                        </Typography>
                    </Box>
                    <Button
                        onClick={handleApprove}
                        type="submit"
                        fullWidth={true}
                        size="large"
                        color="secondary"
                        variant="contained"
                        disabled={approved}
                        sx={{textTransform: "capitalize"}}>
                        {!approved ? "Approve": loading ? "Approving...": "Approved"}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}

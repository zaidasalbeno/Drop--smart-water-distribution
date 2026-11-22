import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
export default function(){

return<>

<Box sx={{color:"black",bgcolor:"blue"}}>
<AppBar sx={{display:"flex",flexDirection:"row"}}>

<Typography variant="h1" sx={{margin:"10px"}}>Drop</Typography>
<Button >Register</Button>
<Button>login</Button>

</AppBar>

</Box>

</>



}
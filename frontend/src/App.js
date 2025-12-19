import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const API_URL = "http://localhost:4000/donations";

const donationTypes = ["Money", "Food", "Clothing", "Other"];

function App() {
  // Local state only mirrors backend data
  const [donations, setDonations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    donorName: "",
    donationType: "",
    amount: "",
    donationDate: "",
  });

  // Fetch donations from backend
  const loadDonations = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setDonations(data);
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const resetForm = () => {
    setForm({
      donorName: "",
      donationType: "",
      amount: "",
      donationDate: "",
    });
    setEditingId(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
  
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  
    resetForm();
    loadDonations();
  };

  const handleEdit = (donation) => {
    setForm({
      donorName: donation.donorName,
      donationType: donation.donationType,
      amount: donation.amount,
      donationDate: donation.donationDate,
    });
    setEditingId(donation.id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadDonations();
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shelter Donation Inventory
      </Typography>

      {/* Donation Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? "Edit Donation" : "Add New Donation"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
        >
          <TextField
            label="Donor Name"
            value={form.donorName}
            onChange={(e) =>
              setForm({ ...form, donorName: e.target.value })
            }
            required
            fullWidth
          />

          <TextField
            select
            label="Donation Type"
            value={form.donationType}
            onChange={(e) =>
              setForm({ ...form, donationType: e.target.value })
            }
            required
            fullWidth
          >
            {donationTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount / Quantity"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            fullWidth
          />

          <TextField
            label="Donation Date"
            type="date"
            value={form.donationDate}
            onChange={(e) =>
              setForm({ ...form, donationDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />

          <Box
            sx={{
              gridColumn: "span 2",
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          > 
            {editingId && (
              <Button variant="outlined" color="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}

            <Button type="submit" variant="contained">
              {editingId ? "Update Donation" : "Add Donation"}
            </Button>
          </Box>
          
        </Box>
      </Paper>

      {/* Donation Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Donor</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {donations.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.donorName}</TableCell>
                <TableCell>{d.donationType}</TableCell>
                <TableCell>{d.amount}</TableCell>
                <TableCell>{d.donationDate}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(d)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(d.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {donations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No donations recorded yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
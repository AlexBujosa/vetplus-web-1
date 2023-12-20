import { ChangeEvent, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Appointment } from "@/types/clinic";
import TextField from "@mui/material/TextField";
import Button from "@/components/button";
import {
  Autocomplete,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useClinic } from "@/hooks/use-clinic";
import { routes } from "@/config/routes";
import { useTranslation } from "react-i18next";
import Image from "@/components/image";
import toast from "react-hot-toast";

interface FormData {
  suffering: string[];
  treatment: string;
  feed: string;
  deworming: {
    date: string;
    product: string;
  };
  reproductiveTimeline: {
    reproductiveHistory: string;
    dateLastHeat: string;
    dateLastBirth: string;
  };
  vaccines: {
    date: string;
    vaccineBrand: string;
    vaccineBatch: string;
  };
}

interface AppointmentResume {
  id: string;
  id_clinic: string;
  id_owner: string;
  observations: {
    suffering: string[];
    treatment: string;
    feed: string;
    deworming: {
      date: string;
      product: string;
    };
    reproductiveTimeline: {
      reproductiveHistory: string;
      dateLastHeat: string;
      dateLastBirth: string;
    };
    vaccines: {
      date: string;
      vaccineBrand: string;
      vaccineBatch: string;
    };
  };
}

const options = [
  "Alergias cutáneas",
  "Bronquitis",
  "Dermatitis",
  "Diabetes",
  "Infección ORL",
  "Infección cutánea",
  "Infección ocular",
  "Infección respiratoria",
  "Parásitos",
  "Problemas dentales",
  "Problemas digestivos",
  "Traumatismos/lesiones",
];

export default function AppointmentForm() {
  const { appointmentId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { updateAppointmentResumen } = useClinic();

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: updateAppointmentResumen,
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const [data, setData] = useState<FormData>({
    suffering: [],
    treatment: "",
    feed: "",
    deworming: {
      date: "",
      product: "",
    },
    reproductiveTimeline: {
      reproductiveHistory: "Entero",
      dateLastHeat: "",
      dateLastBirth: "",
    },
    vaccines: {
      date: "",
      vaccineBrand: "",
      vaccineBatch: "",
    },
  });

  const [appointmentResume, setAppointmentResume] = useState({});

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleDewormingChange = (field: "date" | "product", value: string) => {
    setData((prevData) => ({
      ...prevData,
      deworming: {
        ...prevData.deworming,
        [field]: value,
      },
    }));
  };

  const handleVaccineChange = (
    field: "date" | "vaccineBrand" | "vaccineBatch",
    value: string
  ) => {
    setData((prevData) => ({
      ...prevData,
      vaccines: {
        ...prevData.vaccines,
        [field]: value,
      },
    }));
  };

  const handleSufferingChange = (
    event: ChangeEvent<any>,
    newValue: string[]
  ) => {
    setSelectedOptions(newValue);
    setData({
      ...data,
      suffering: newValue,
    });
  };

  const appointments: Appointment[] | undefined = queryClient.getQueryData([
    "appointments",
  ]);

  if (!appointments) return null;

  const appointment = appointments.filter(({ id }) => {
    return id === appointmentId;
  });

  if (!appointment) return null;

  const { Owner, Pet } = appointment[0];

  const { names } = Owner;
  const { name } = Pet;

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const {
      suffering,
      treatment,
      feed,
      deworming,
      vaccines,
      reproductiveTimeline,
    } = data;

    const { id, id_clinic, id_owner } = appointment[0];

    const newAppointmentResume = {
      id,
      id_clinic,
      id_owner,
      observations: {
        suffering,
        treatment,
        feed,
        deworming,
        vaccines,
        reproductiveTimeline,
      },
    };

    setAppointmentResume(newAppointmentResume);
    console.log("APPOINTMENT RESUME:", appointmentResume);

    const onSubmit = async () => {
      try {
        await mutateAsync({ ...newAppointmentResume });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        console.log("DATA:", newAppointmentResume);
        toast.success(t("updated-fields"));
      } catch (e) {
        console.log(e);
      }
    };
    onSubmit();
  };

  return (
    <section className="w-auto">
      <Typography gutterBottom>
        <div className="font-semibold">Historial Clínico</div>
      </Typography>
      <Divider />
      <form className="pt-6">
        <div className="flex-2 flex gap-16 mb-4">
          <div className="flex-col py-2">
            <p className="pb-1 font-semibold">Dueño</p>
            <div className="flex gap-2">
              <Image
                src={Owner.image}
                className="rounded-full w-10 h-10 max-w-10"
              />
              <div className="pt-2">{names}</div>
            </div>
          </div>
          <div className="flex-col py-2">
            <p className="pb-1 font-semibold">Mascota</p>
            <div className="flex gap-2">
              <Image
                src={Pet.image}
                className="rounded-full w-10 h-10 max-w-10"
              />
              <div className="pt-2">{name}</div>
            </div>
          </div>
        </div>
        <p className="font-bold py-4">Última Desparasitación</p>
        <div className="flex gap-16 mb-4">
          <div>
            <label className="block mb-2 font-semibold">Fecha</label>
            <TextField
              type="date"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "35px",
                  width: "20rem",
                },
              }}
              onChange={(e) => handleDewormingChange("date", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Producto</label>
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "35px",
                  width: "20rem",
                },
              }}
              onChange={(e) => handleDewormingChange("product", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">
              Historia reproductiva
            </label>
            <FormControl
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "35px",
                  width: "15rem",
                },
              }}
            >
              <Select
                value={data.reproductiveTimeline.reproductiveHistory}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    height: "10px",
                    width: "15rem",
                  },
                }}
                onChange={(e) => {
                  setData({
                    ...data,
                    reproductiveTimeline: {
                      ...data.reproductiveTimeline,
                      reproductiveHistory: e.target.value as string,
                    },
                  });
                }}
              >
                <MenuItem
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "15px",
                      width: "15rem",
                    },
                  }}
                  value="Entero"
                >
                  Entero
                </MenuItem>
                <MenuItem
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "15px",
                      width: "15rem",
                    },
                  }}
                  value="Esterilizado"
                >
                  Esterilizado
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <p className="font-bold mb-4">Vacunas</p>
        <div className="flex gap-16">
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Fecha</label>
            <TextField
              type="date"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "35px",
                  width: "20rem",
                },
              }}
              onChange={(e) => handleVaccineChange("date", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Marca</label>
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "35px",
                  width: "20rem",
                },
              }}
              onChange={(e) =>
                handleVaccineChange("vaccineBrand", e.target.value)
              }
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Lote</label>
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "35px",
                  width: "20rem",
                },
              }}
              onChange={(e) =>
                handleVaccineChange("vaccineBatch", e.target.value)
              }
            />
          </div>
        </div>
        <div className="py-4">
          <label className="block mb-2 font-semibold">Padecimientos</label>
          <Autocomplete
            multiple
            options={options}
            value={selectedOptions}
            onChange={handleSufferingChange}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select options"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    width: "40rem",
                  },
                }}
              />
            )}
            renderOption={(props, option, { selected }) => (
              <li
                {...props}
                style={{ backgroundColor: selected ? "lightblue" : "white" }}
              >
                {option}
              </li>
            )}
          />
        </div>
        <div className="flex gap-16 py-4">
          <div>
            <label className="block mb-2 font-semibold">Tratamientos</label>
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "55px",
                  width: "25rem",
                },
              }}
              onChange={(e) => {
                setData({ ...data, treatment: e.target.value });
              }}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Alimentación</label>
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "55px",
                  width: "25rem",
                },
              }}
              onChange={(e) => {
                setData({ ...data, feed: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="flex gap-16 pt-8">
          <div>
            <label className="block mb-2 font-semibold">
              Fecha última parto
            </label>
            <TextField
              type="date"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "35px",
                  width: "20rem",
                },
              }}
              onChange={(e) => {
                setData({
                  ...data,
                  reproductiveTimeline: {
                    ...data.reproductiveTimeline,
                    dateLastBirth: e.target.value,
                  },
                });
              }}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Último celo</label>
            <TextField
              type="date"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  height: "35px",
                  width: "20rem",
                },
              }}
              onChange={(e) => {
                setData({
                  ...data,
                  reproductiveTimeline: {
                    ...data.reproductiveTimeline,
                    dateLastHeat: e.target.value,
                  },
                });
              }}
            />
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSubmit}
            style={{
              borderRadius: "10px",
              height: "35px",
              width: "20rem",
              backgroundColor: "#239BCD",
            }}
          >
            Guardar y cerrar
          </Button>
        </div>
      </form>
    </section>
  );
}

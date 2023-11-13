import Input from "@/components/input";
import { Body, Title } from "@/components/typography";
import { SearchOutlined } from "@mui/icons-material";
import { Avatar, AvatarGroup, InputAdornment, Skeleton } from "@mui/material";
import Table, { Row } from "@/components/table";
import { useTranslation } from "react-i18next";
import { useClinic } from "@/hooks/use-clinic";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/components/profile";
import { AppointmentOwner, Pet } from "@/types/constant/admin/clients";

export default function ClientsPage() {
  const { t } = useTranslation();
  const { getMyClients } = useClinic();

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getMyClients,
  });

  const columns = [
    t("clients"),
    t("email"),
    t("pets"),
    t("telephone-number"),
    t("last-appointment"),
  ];

  const rows = isLoading ? TableLoadingRows() : ClientsRowValues(clients);

  function TableLoadingRows(): Row[] {
    return [
      {
        key: "",
        values: [...Array(columns.length)].map(() => <Skeleton />),
      },
    ];
  }
  interface GetAllClient {
    User: {
      names: string;
      surnames: string;
      email: string;
      image: string;
      telephone_number: string;
      Pet: Pet[];
      AppointmentOwner: AppointmentOwner[];
    };
  }

  function ClientsRowValues(clients: GetAllClient[]): Row[] {
    return clients.map((client) => {
      const { User } = client;
      const {
        names,
        surnames,
        email,
        image,
        telephone_number,
        Pet,
        AppointmentOwner,
      } = User;
      const values = [
        <Profile profile={`${names} ${surnames}`} image={image} />,
        <Body.Medium className="text-base-neutral-gray-900" text={email} />,
        <Pets pets={Pet} />,
        <Body.Medium
          className="text-base-neutral-gray-900"
          text={telephone_number ?? "N/A"}
        />,
        <Body.Medium
          className="text-base-neutral-gray-900"
          text={
            AppointmentOwner.length > 0
              ? new Date(AppointmentOwner[0].start_at).toISOString()
              : "N/A"
          }
        />,
      ];

      return {
        key: email,
        values,
      };
    });
  }

  return (
    <>
      <Title.Large text={t("clients")} />

      <Input
        className="w-[300px] bg-white text-base-neutral-gray-700 shadow-elevation-1"
        variant="outlined"
        placeholder={t("search-clients")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined />
            </InputAdornment>
          ),
        }}
      />

      <Table columns={columns} rows={rows} />
    </>
  );
}

function Pets({ pets }: { pets: Pet[] }) {
  return (
    <AvatarGroup max={4}>
      {pets.map((pet) => {
        return (
          <Avatar
            key={pet.id}
            className="w-8 h-8"
            alt={pet.name}
            src={pet.image}
          />
        );
      })}
    </AvatarGroup>
  );
}

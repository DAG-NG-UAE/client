"use client";

import { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        gap: 2,
        px: 3,
      }}
    >
      <Typography variant="h3" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
        An unexpected error occurred. You can try again or return to the
        dashboard.
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={reset}>
          Try again
        </Button>
        <Button variant="outlined" onClick={() => router.push("/dashboard")}>
          Go to dashboard
        </Button>
      </Box>
    </Box>
  );
}

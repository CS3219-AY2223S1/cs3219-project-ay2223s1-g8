# GKE cluster
resource "google_container_cluster" "primary" {
  name     = "peerprep-cluster"
  location = var.region

  # Enabling Autopilot for this cluster
  enable_autopilot = true
}

# GKE cluster
resource "google_container_cluster" "primary" {
  name     = "peerprep-cluster2"
  location = var.region

  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name

  # Enabling Autopilot for this cluster
  enable_autopilot = true
}

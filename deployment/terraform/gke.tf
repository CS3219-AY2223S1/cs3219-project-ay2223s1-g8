variable "project_id" {
  description = "project id"
}

variable "region" {
  description = "region"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# GKE cluster
resource "google_container_cluster" "primary" {
  name     = "peerprep-cluster"
  location = var.region

  # Enabling Autopilot for this cluster
  enable_autopilot = true
}

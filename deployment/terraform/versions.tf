terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.3.0"
    }
  }

  required_version = ">= 0.14"

  backend "gcs" {
    bucket = "peerprep-bucket-tfstate"
    prefix = "terraform/state"
  }
}

# Google cloud bucket to store tfstate file
resource "google_storage_bucket" "default" {
  name          = "650764b83e8fdbee-bucket-tfstate"
  force_destroy = false
  location      = var.region
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

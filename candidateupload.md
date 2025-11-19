Build a candidate profile upload interface supporting 1-5 files and automatically transforming vertical form data into a standard table format for mapping.

FLOW:
1. User clicks "Upload Candidate Profile" button.
2. **Step 1: File Upload Screen** appears.
   - User is prompted to select **1 to 5 Excel files** (.xlsx, .xls, .csv).
   - Validation ensures a minimum of 1 and maximum of 5 files are selected.
   - Upon upload, the system immediately processes each file:
     - It reads the **Source Labels** from **Column B (Rows 2-23)**.
     - It reads the corresponding **Values** from **Column C (Rows 2-23)**.
     - It **pivots/transforms** this vertical form into a standard horizontal data record, using the labels from Column B as the new **Headers**.
   - User clicks "Next" to proceed.

3. **Step 2: Column Mapping Screen** appears.
   - The system uses the **Transformed Headers** (e.g., 'Name', 'Email', 'Mobile No') from the uploaded files as the mapping source.
   - **Mapping Interface:** Shows two columns:
     - **Left (Target):** Required **Database Fields** (Candidate Name, Email, Phone, Years Experience, etc.). These are fixed.
     - **Right (Source):** Dropdown for each field, populated by the **Transformed Headers**.
4. User maps the Transformed Headers to the Database Fields.
5. "Save Mapping as Default" checkbox is offered.
6. **Preview Table** displays the first 3 **Transformed Data Rows** (from all uploaded files combined).
7. User clicks "Import" $\rightarrow$ Data (all transformed records from 1-5 files) is sent to the backend $\rightarrow$ Success message.

REQUIREMENTS:
- Support multi-file upload (1-5 files).
- The system must perform **pre-mapping transformation** of the vertical form data into a standard table format.
- The mapping UI must use the **Transformed Headers** as its source.
- Validate required DB fields are mapped before import.
- Save mapping preferences in browser `localStorage`.
- Pre-fill dropdowns with saved mapping on subsequent uploads.
- The backend must receive and process the standardized, pre-transformed data (an array of candidate objects).
- Display success/error summary after processing all files.
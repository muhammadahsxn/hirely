# Hirely — Data Model

## Overview

Hirely uses a relational data model. PostgreSQL will store users, CVs, analyses, and user settings.

## Entities

### User

Represents a registered Hirely user.

- id
- name
- email
- password/authentication data
- createdAt
- updatedAt

Relationships:
- A user can have multiple CVs.
- A user can have multiple analyses.
- A user has one settings record.

### CV

Represents a CV uploaded by a user.

- id
- userId
- original filename
- file location
- file type
- extracted structured data
- createdAt
- updatedAt

Relationships:
- Belongs to one user.
- Can have multiple analyses.

### Analysis

Represents one AI analysis performed on a CV.

- id
- userId
- cvId
- target role
- overall score
- analysis status
- createdAt

Relationships:
- Belongs to one user.
- Belongs to one CV.
- Has one analysis result.

### AnalysisResult

Stores the structured output produced by the AI analysis.

- id
- analysisId
- overview
- strengths
- weaknesses
- skills analysis
- section feedback
- recommendations
- createdAt

Relationships:
- Belongs to one analysis.

### UserSettings

Stores user-specific application preferences.

- id
- userId
- theme
- preferred language
- notification preferences
- createdAt
- updatedAt

Relationships:
- Belongs to one user.

## Relationships

User
→ CV (one-to-many)

User
→ Analysis (one-to-many)

User
→ UserSettings (one-to-one)

CV
→ Analysis (one-to-many)

Analysis
→ AnalysisResult (one-to-one)

## Design Principles

- Every user's data must be isolated from other users.
- Database records should use stable unique identifiers.
- Relationships should use foreign keys.
- Timestamps should be stored for important records.
- Sensitive authentication data must not be stored as plain text.
- AI-generated results should be stored in a structured format rather than only as unstructured text.
{{/*
Expand the chart name.
*/}}
{{- define "orders-dashboard.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a fully qualified app name.
*/}}
{{- define "orders-dashboard.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- include "orders-dashboard.name" . }}
{{- end }}
{{- end }}

{{/*
Common labels.
*/}}
{{- define "orders-dashboard.labels" -}}
app.kubernetes.io/name: {{ include "orders-dashboard.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end }}

{{/*
Selector labels.
*/}}
{{- define "orders-dashboard.selectorLabels" -}}
app.kubernetes.io/name: {{ include "orders-dashboard.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Namespace
*/}}
{{- define "orders-dashboard.namespace" -}}
{{- .Values.namespace -}}
{{- end }}

{{/*
Secret Name
*/}}
{{- define "orders-dashboard.secretName" -}}
{{ printf "%s-secret" (include "orders-dashboard.fullname" .) }}
{{- end }}

{{/*
ConfigMap Name
*/}}
{{- define "orders-dashboard.configMapName" -}}
{{ printf "%s-config" (include "orders-dashboard.fullname" .) }}
{{- end }}

{{/*
Backend selector labels
*/}}
{{- define "orders-dashboard.backendLabels" -}}
{{ include "orders-dashboard.selectorLabels" . }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Frontend selector labels
*/}}
{{- define "orders-dashboard.frontendLabels" -}}
{{ include "orders-dashboard.selectorLabels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Postgres selector labels
*/}}
{{- define "orders-dashboard.postgresLabels" -}}
{{ include "orders-dashboard.selectorLabels" . }}
app.kubernetes.io/component: postgres
{{- end }}
# Stage 1: Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Stage 2: Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
# Copy file csproj và restore dependencies
COPY ["tech-retail-api.csproj", "./"]
RUN dotnet restore "tech-retail-api.csproj"

# Copy toàn bộ source code
COPY . .
# Build và publish ra thư mục /app/publish
RUN dotnet publish "tech-retail-api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final image chạy thật
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "tech-retail-api.dll"]
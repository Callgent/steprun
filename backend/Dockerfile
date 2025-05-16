FROM python:3.11-slim AS builder

# install gosu
RUN apt-get update && apt-get install -y --no-install-recommends gosu curl ca-certificates
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
RUN curl -sL https://github.com/dmtcp/dmtcp/archive/refs/tags/3.2.0.tar.gz -o /tmp/3.2.0.tar.gz

ENV PATH="/root/.local/bin:$PATH"
RUN gosu --version

FROM python:3.11-slim

# copy dmtcp
COPY --from=builder /tmp/3.2.0.tar.gz /tmp/
# Install uv
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#installing-uv
COPY --from=ghcr.io/astral-sh/uv:0.5.11 /uv /uvx /bin/
# copy gosu
COPY --from=builder /usr/sbin/gosu /usr/sbin/gosu
RUN gosu --version && uv --version

# install essential tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential gcc g++ \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# install DMTCP
RUN tar -xzf /tmp/3.2.0.tar.gz -C /tmp/ && \
    cd /tmp/dmtcp-3.2.0 && \
    ./configure --prefix=/usr/local && \
    make && make install
RUN rm -rf /tmp/dmtcp-3.2.0 /tmp/3.2.0.tar.gz

RUN uv pip install nanoid --system --compile-bytecode

# Create /sandboxes, /sandboxes/snapshots, and /sandboxes/shared_libs with appropriate permissions
RUN mkdir -p /sandboxes/snapshots /sandboxes/shared_libs \
    && chmod 1731 /sandboxes \
    && chown root:root /sandboxes \
    && chmod 700 /sandboxes/snapshots \
    && chown root:root /sandboxes/snapshots \
    && chmod 755 /sandboxes/shared_libs \
    && chown root:root /sandboxes/shared_libs \
    # limit all */tmp readonly for non-root
    && chmod 755 /tmp /var/tmp /dev/shm /run/lock

ENV PYTHONNOUSERSITE=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV SANDBOX_PREFIX=/sandboxes/sandbox_
ENV SHARED_LIBS_PATH=/sandboxes/shared_libs
ENV SNAPSHOT_DIR=/sandboxes/snapshots

# Install global shared dependencies using uv pip
# COPY requirements.txt /tmp/requirements.txt
# RUN uv pip install --compile-bytecode --target /sandboxes/shared_libs --no-cache-dir -r requirements.txt \
# && rm /tmp/requirements.txt

# Create sandboxed user (no login shell, no home dir)
RUN useradd -r -M -s /usr/sbin/nologin sandboxed

# set PYTHONSTARTUP script
ENV PYTHONSTARTUP=/usr/local/bin/python_startup.py
COPY ./docker/python_startup.py /usr/local/bin/python_startup.py
RUN chmod 644 /usr/local/bin/python_startup.py \
    && chown root:root /usr/local/bin/python_startup.py

# USER root

WORKDIR /app/

# Place executables in the environment at the front of the path
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#using-the-environment
ENV PATH="/app/.venv/bin:$PATH"

ENV PYTHONUNBUFFERED=1
# Compile bytecode
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#compiling-bytecode
ENV UV_COMPILE_BYTECODE=1
# uv Cache
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#caching
ENV UV_LINK_MODE=copy

# Install dependencies
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#intermediate-layers
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

ENV PYTHONPATH=/app

COPY ./scripts /app/scripts

COPY ./pyproject.toml ./uv.lock ./alembic.ini /app/

COPY ./app /app/app

# Sync the project
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#intermediate-layers
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync

EXPOSE 8000

CMD ["sh", "-c", "dmtcp_coordinator --daemon && fastapi run --workers 4 app/main.py"]

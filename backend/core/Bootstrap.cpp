#include "Bootstrap.h"

#include "../utils/Config.h"
#include "../utils/Logger.h"

Bootstrap::Bootstrap(Config& config, const std::string& logFile)
    : config_(config),
      logFile_(logFile)
{
}

bool Bootstrap::initialize()
{
    Logger logger(logFile_, config_.getLogLevel());

    logger.info("Bootstrap inicializado.");

    return true;
}
